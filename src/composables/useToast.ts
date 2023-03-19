import type { CustomMethods, FullToast, Settings, Status, Toast } from '../type';
import ToastContainer from '../components/ToastContainer.vue';
interface ToastPluginAPI {
    notify: (status: Status, title?: string) => Toast;
    success: (status: Status, title?: string) => Toast;
    info: (status: Status, title?: string) => Toast;
    warning: (status: Status, title?: string) => Toast;
    error: (status: Status, title?: string) => Toast;
    loader: (status: Status, title?: string) => Toast;
    prompt: (status: FullToast, title?: string) => Promise<Toast>;
    removeToast: (id?: Toast['id']) => boolean;
    updateToast: (id: Toast['id'], status: FullToast) => Toast;
    settings: (settings?: Settings) => Settings;
    getToast: (id: Toast['id']) => Toast | undefined;
    stopLoader: (id: Toast['id']) => number;
}

export const customMethods: CustomMethods = {};
export let container: Pick<InstanceType<typeof ToastContainer>, 'add'>;

export default function useToast(): ToastPluginAPI | CustomMethods {
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
        return container.add(status);
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
        if (typeof status === 'string') {
            status = {
                body: status
            };
        }
        if ('status' in status && status.statusText) {
            status = {
                title: status.status.toString(),
                body: status.statusText
            };
        }
        if (title) {
            status.title = title;
        }
        status.type = 'error';
        return notify(status);
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
    const prompt = async (status: Status, title?: string) => {
        if (typeof status === 'string') {
            status = {
                body: status
            };
        }
        if (title) {
            status.title = title;
        }
        status.mode = 'prompt';
        const id = ToastContainer.add(status);
        return new Promise(resolve => {
            ToastContainer.$root.$once('vtPromptResponse', payload => {
                if (payload.id === id) {
                    resolve(payload.response);
                }
            });
        });
    };

    return {
        notify,
        success,
        info,
        warning,
        error,
        loader,
        prompt,
        stopLoader(id?: Toast['id']) {
            ToastContainer.stopLoader(id);
        },
        getToast(id?: Toast['id']): Toast | undefined {
            return ToastContainer.get(id);
        },
        updateToast(id: Toast['id'], status): Toast {
            return ToastContainer.set(id, status);
        },
        removeToast(id?: Toast['id']): boolean {
            return ToastContainer.remove(id);
        },
        settings(settings?: Settings): Settings {
            if (settings) {
                ToastContainer.setSettings(settings);
            }

            return ToastContainer.getSettings();

            return ToastContainer.setSettings(settings);
        }
    };
}
