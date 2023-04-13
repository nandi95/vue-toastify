import useVtEvents from './composables/useVtEvents';
import plugin from './plugin';
import useToast from './composables/useToast';
import { default as useVtSettings } from './composables/useSettings';
import './assets/index.scss';

export {
    useVtEvents,
    useToast,
    useVtSettings
};

export default plugin;
