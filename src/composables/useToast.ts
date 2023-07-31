import type {
    ContainerMethods,
    Settings,
    Status,
    Toast,
    ToastOptions
} from '../type';
import useSettings from './useSettings';
import useVtEvents from './useVtEvents';

export type CustomMethods = Record<string, (status?: Status, title?: string) => string>;

export interface ToastPluginAPI {
    notify: (status: Status, title?: string) => Toast['id'];
    success: (status: Status, title?: string) => Toast['id'];
    info: (status: Status, title?: string) => Toast['id'];
    warning: (status: Status, title?: string) => Toast['id'];
    error: (status: Status, title?: string) => Toast['id'];
    loader: (status: Status, title?: string) => Toast['id'];
    prompt: <T>(status: Omit<ToastOptions, 'mode' | 'answers'> & { answers: Record<string, T> }) => Promise<T>;
    updateToast: (id: Toast['id'], status: ToastOptions) => boolean;
    settings: (settings?: Settings) => Settings;
    findToast: <T extends Toast['id']>(id: T) => Toast | undefined;
    getToasts: () => Toast[];
    stopLoader: (id?: Toast['id']) => number;
    remove: (id?: Toast['id']) => number;
}

// @ts-expect-error
//eslint-disable-next-line prefer-const
export let app: { container: ContainerMethods } = {};

const notify = (status: Status, title?: string): ReturnType<ToastPluginAPI['notify']> => {
    if (typeof status === 'string') {
        status = {
            body: status
        };
    }
    if (title) {
        status.title = title;
    }
    if (!status.type) {
        status.type = 'success';
    }
    return app.container.add(status);
};

export const toastMethods: ToastPluginAPI = {
    notify,
    success: (status: Status, title?: string) => notify(status, title),
    info: (status: Status, title?: string) => {
        if (typeof status === 'string') {
            status = {
                body: status
            };
        }
        if (title) {
            status.title = title;
        }
        status.type = 'info';
        return notify(status);
    },
    warning: (status: Status, title?: string) => {
        if (typeof status === 'string') {
            status = {
                body: status
            };
        }
        if (title) {
            status.title = title;
        }
        status.type = 'warning';
        return notify(status);
    },
    error: (status: Status, title?: string) => {
        const notification = {} as ToastOptions;

        if (typeof status === 'string') {
            notification.body = status;
        }

        if (title) {
            notification.title = title;
        }

        notification.type = 'error';

        return notify(notification);
    },
    loader: (status: Status, title?: string) => {
        if (typeof status === 'string') {
            status = {
                body: status
            };
        }
        if (title) {
            status.title = title;
        }
        status.mode = 'loader';
        return notify(status);
    },
    prompt: async <T>(status: Omit<ToastOptions, 'mode' | 'answers'> & { answers: Record<string, T> }) => {
        (status as ToastOptions).mode = 'prompt';

        const events = useVtEvents();
        const toastId = app.container.add(status);

        return new Promise<T>(resolve => {
            events.once('vtPromptResponse', payload => {
                if (payload.id === toastId) {
                    resolve(payload.response as T);
                }
            });
        });
    },
    stopLoader(id?: Toast['id']): number {
        return app.container.stopLoader(id);
    },
    findToast(id?: Toast['id']): Toast | undefined {
        return app.container.get(id);
    },
    getToasts(): Toast[] {
        return app.container.get() as unknown as Toast[];
    },
    updateToast(id: Toast['id'], status: ToastOptions): boolean {
        return app.container.set(id, status);
    },
    remove(id?: Toast['id']): number {
        return app.container.remove(id);
    },
    settings(settings?: Settings): Settings {
        const settingsComposable = useSettings();

        return settings ? settingsComposable.updateSettings(settings) : settingsComposable.settings;
    }
};

export default function useToast(): ToastPluginAPI {
    return toastMethods;
}
