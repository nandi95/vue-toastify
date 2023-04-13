import type { InjectionKey, Plugin } from 'vue';
import type { ContainerMethods, Settings, Status, ToastOptions } from './type';
import { createApp } from 'vue';
import ToastContainer from './components/ToastContainer.vue';
import { customMethods, app } from './composables/useToast';
import useSettings from './composables/useSettings';

const pluginInjectionKey: InjectionKey<any> = Symbol('vue-toastify');
const plugin: Plugin = (_, settings: Settings = {}) => {
    useSettings().updateSettings(settings);

    const mountPoint = document.createElement('div');
    mountPoint.setAttribute('id', pluginInjectionKey.toString());
    document.body.appendChild(mountPoint);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    app.container = createApp(ToastContainer).mount(mountPoint) as unknown as ContainerMethods;

    if (
        settings.customNotifications &&
            Object.entries(settings.customNotifications).length > 0
    ) {
        Object.entries(settings.customNotifications).forEach(keyValArr => {
            Object.defineProperty(customMethods, keyValArr[0], {
                get() {
                    return (status: Status, title = null) => {
                        let toast: ToastOptions = Object.assign({}, keyValArr[1]);

                        if (typeof status === 'string') {
                            toast.body = status;
                        } else {
                            toast = { ...keyValArr[1], ...status };
                        }

                        if (title) {
                            toast.title = title;
                        }
                        return app.container.add(toast);
                    };
                }
            });
        });
    }
};

export default plugin;
