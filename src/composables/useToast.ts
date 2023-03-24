import type {
    ContainerMethods,
    CustomMethods,
    Settings,
    Status,
    Toast,
    ToastOptions
} from '../type';
import useSettings from './useSettings';
import useVtEvents from './useVtEvents';

interface ToastPluginAPI {
    notify: (status: Status, title?: string) => Toast;
    success: (status: Status, title?: string) => Toast;
    info: (status: Status, title?: string) => Toast;
    warning: (status: Status, title?: string) => Toast;
    error: (status: Status, title?: string) => Toast;
    loader: (status: Status, title?: string) => Toast;
    prompt: <T>(status: Omit<ToastOptions, 'mode' | 'answers'> & { answers: Record<string, T> }) => Promise<T>;
    updateToast: (id: Toast['id'], status: ToastOptions) => boolean;
    settings: (settings?: Settings) => Settings;
    findToast: <T extends Toast['id']>(id: T) => Toast | undefined;
    getToasts: () => Toast[];
    stopLoader: (id?: Toast['id']) => number;
    remove: (id?: Toast['id']) => number;
}

export const customMethods: CustomMethods = {};
// @ts-expect-error
//eslint-disable-next-line prefer-const
export let app: { container: ContainerMethods } = {};

export default function useToast(): ToastPluginAPI & CustomMethods {
    const notify = (status: Status, title?: string) => {
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
    const success = (status: Status, title?: string) => notify(status, title);
    const info = (status: Status, title?: string) => {
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
    };
    const warning = (status: Status, title?: string) => {
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
    };
    const error = (status: Status | Response, title?: string) => {
        const notification = {} as ToastOptions;

        if (typeof status === 'string') {
            notification.body = status;
        }
        if (status instanceof Response) {
            notification.title = status.status.toString();
            notification.body = status.statusText;
        }
        if (title) {
            notification.title = title;
        }

        notification.type = 'error';

        return notify(notification);
    };
    const loader = (status: Status, title?: string) => {
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
    };
    const prompt = async <T>(status: Omit<ToastOptions, 'mode' | 'answers'> & { answers: Record<string, T> }) => {
        (status as ToastOptions).mode = 'prompt';

        const events = useVtEvents();
        const toast = app.container.add(status);

        return new Promise<T>(resolve => {
            events.once('vtPromptResponse', payload => {
                if (payload.id === toast.id) {
                    resolve(payload.response as T);
                }
            });
        });
    };

    return {
        ...customMethods,
        notify,
        success,
        info,
        warning,
        error,
        loader,
        prompt,
        stopLoader(id?: Toast['id']) {
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
}
