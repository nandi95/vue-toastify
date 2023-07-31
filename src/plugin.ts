import type { InjectionKey, Plugin } from 'vue';
import type { ContainerMethods, Settings, Status, ToastOptions } from './type';
import { createApp } from 'vue';
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore - the shim is not being picked up by the build ts config, and we don't want to deliver the shim either
import ToastContainer from './components/ToastContainer.vue';
import { toastMethods, app } from './composables/useToast';
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
        const reservedMethods = Object.keys(toastMethods);

        Object.entries(settings.customNotifications).forEach(keyValArr => {
            if (reservedMethods.includes(keyValArr[0])) {
                throw new Error(`The method name ${keyValArr[0]} is reserved by vue-toastify.`);
            }

            Object.defineProperty(toastMethods, keyValArr[0], {
                get() {
                    return (status: Status, title?: string) => {
                        let toast: ToastOptions = Object.assign({}, keyValArr[1]);

                        if (typeof status === 'string') {
                            toast.body = status;
                        } else {
                            toast = { ...keyValArr[1], ...status };
                        }

                        if (title) {
                            toast.title = title;
                        }

                        if (!toast.type) {
                            toast.type = 'success';
                        }

                        return app.container.add(toast);
                    };
                }
            });
        });
    }
};

export default plugin;
