import type { Settings } from '../type';
import { reactive, readonly } from 'vue';
import type { DeepReadonly } from 'vue';

type DefaultSettings = Omit<Required<Settings>, 'transition'> & Pick<Settings, 'transition'>;

const settings = reactive<DefaultSettings>({
    singular: false,
    withBackdrop: false,
    backdrop: 'rgba(0, 0, 0, 0.2)',
    position: 'bottom-right',
    defaultTitle: true,
    canTimeout: true,
    pauseOnHover: false,
    iconEnabled: true,
    draggable: true,
    dragThreshold: 0.75,
    hideProgressbar: false,
    errorDuration: 8000,
    successDuration: 4000,
    warningInfoDuration: 6000,
    theme: 'dark',
    baseIconClass: '',
    orderLatest: true,
    transition: undefined,
    oneType: false,
    maxToasts: 6,
    customNotifications: {}
});

type UseSettings = {
    settings: DeepReadonly<DefaultSettings>;
    updateSettings: <T extends keyof Settings | Settings>(
        key: T,
        value?: T extends keyof Settings ? Settings[T] : never
    ) => Settings;
};

/**
 * Base settings applying plugin wide.
 */
export default function useSettings(): UseSettings {
    return {
        settings: readonly(settings),
        updateSettings: (key, newSettings) => {
            let settingsNew = {} as Settings;

            if (typeof key === 'object' && newSettings === undefined) {
                settingsNew = key;
            } else if (typeof key === 'string') {
                settingsNew = { [key]: newSettings };
            }

            return Object.assign(settings, settingsNew);
        }
    };
}
