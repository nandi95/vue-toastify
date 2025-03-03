import type { Settings } from '../type';
import { reactive, readonly } from 'vue';

type DefaultSettings = Omit<Required<Settings>, 'transition'> & Pick<Settings, 'transition'>;

const settings = reactive<DefaultSettings>({
    singular: false,
    withBackdrop: false,
    backdrop: 'rgba(0, 0, 0, 0.2)',
    position: 'bottom-right',
    defaultTitle: true,
    canTimeout: true,
    pauseOnHover: false,
    pauseOnFocusLoss: true,
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
    customNotifications: {},
    enableHtmlInterpretation: true
});

type UseSettings = {
    settings: DefaultSettings;
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
        settings: readonly(settings) as DefaultSettings,
        updateSettings: (key, newSettings) => {
            let settingsNew = {} as Settings;

            if (typeof key === 'object' && newSettings === undefined) {
                settingsNew = key;
            } else if (typeof key === 'string') {
                settingsNew = { [key]: newSettings };
            }

            return readonly(Object.assign(settings, settingsNew)) as Settings;
        }
    };
}
