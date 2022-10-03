import { InjectionKey } from 'vue';

interface Constants {
    injectionKey: InjectionKey<symbol>;
}

export default {
    injectionKey: Symbol('toastify')
} as Constants;
