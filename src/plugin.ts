import type { InjectionKey, Plugin } from 'vue';
import { Settings, Status, ToastOptions } from './type';
import { createApp } from 'vue';
import ToastContainer from './components/ToastContainer.vue';
import { customMethods, container } from './composables/useToast';
import useSettings from './composables/useSettings';

export const pluginInjectionKey: InjectionKey<any> = Symbol('vue-toastify');
const plugin: Plugin = (app, settings: Settings = {}) => {
    useSettings().updateSettings(settings);
    const mountPoint = document.createElement('div');
    mountPoint.setAttribute('id', pluginInjectionKey.toString());
    document.body.appendChild(mountPoint);
    const toastApp = createApp(ToastContainer).mount(mountPoint);
    container = toastApp;

    if (
        settings.customNotifications &&
            Object.entries(settings.customNotifications).length > 0
    ) {
        Object.entries(settings.customNotifications).forEach(keyValArr => {
            Object.defineProperty(customMethods, keyValArr[0], {
                get() {
                    return (status: Status, title = null) => {
                        let toast: Partial<ToastOptions> = {};
                        toast = Object.assign(toast, keyValArr[1]);
                        if (typeof status === 'string') {
                            toast.body = status;
                        } else {
                            toast = { ...keyValArr[1], ...status };
                        }
                        if (title) {
                            toast.title = title;
                        }
                        return container.add(toast);
                    };
                }
            });
        });
    }

    app.config.globalProperties.$vtNotify = vtNotify;
    app.$vtNotify = vtNotify;
    app.config.globalProperties.$vToastify = toastify;
    app.$vToastify = toastify;
};

export default plugin;
