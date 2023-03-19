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

type UpdateSettings =
    ((newSettings: Settings) => Settings) |
    (<T extends keyof Settings>(key: T, value: Settings[T]) => Settings);

type UseSettings = {
    settings: DeepReadonly<DefaultSettings>;
    updateSettings: UpdateSettings;
};

/**
 * Base settings applying plugin wide.
 */
export default function useSettings(): UseSettings {
    const updateSettings: UpdateSettings = <T extends keyof Settings | Settings>(
        key: T,
        newSettings?: Settings | Settings[keyof Settings]
    ) => {
        if (arguments.length === 1 && typeof key === 'object') {
            newSettings = key;
        } else if (arguments.length === 2 && typeof key === 'string') {
            newSettings = { [key]: newSettings };
        }

        return Object.assign(settings, newSettings);
    };
    return {
        settings: readonly(settings),
        updateSettings
    };
}
