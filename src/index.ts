import useVtEvents from './composables/useVtEvents';
import plugin from './plugin';
import useToast from './composables/useToast';
import { default as useVtSettings } from './composables/useSettings';
import createVtTheme, { getCssRules } from './composables/createVtTheme';

export type { Settings, ToastOptions, Status } from './type';
export type { ToastPluginAPI, CustomMethods } from './composables/useToast';

export {
    useVtEvents,
    useToast,
    useVtSettings,
    createVtTheme,
    getCssRules
};

export default plugin;
