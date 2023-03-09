import type { InjectionKey, Plugin } from 'vue';
import { Settings, Status, ToastOptions } from './type';
import constants from './components/constants';
import { createApp } from 'vue';
import ToastContainer from './components/ToastContainer.vue';

export const pluginInjectionKey: InjectionKey<any> = Symbol('vue-toastify');
const plugin: Plugin = (app, settings: Settings = {}) => {
    const toastApp = createApp(ToastContainer, settings);

    ToastContainer._props = Object.assign(ToastContainer._props, settings);

    const vm = ToastContainer.$mount();

    document.body.appendChild(vm.$el);

    app.use(ToastContainer);

    if (
        settings.customNotifications &&
            Object.entries(settings.customNotifications).length > 0
    ) {
        Object.entries(settings.customNotifications).forEach(keyValArr => {
            Object.defineProperty(toastify, keyValArr[0], {
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
                        return vtNotify(toast);
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
