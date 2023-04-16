## install

```ts
import type { UserModule } from '~/types';
import plugin from 'vue-toastify';
import 'vue-toastify/index.css';
import type { Settings } from 'vue-toastify';

export const install: UserModule = ({ app }) => {
    const pluginSettings: Settings = {
        .
        .
        .
    };

    app.use(plugin, pluginSettings);
};

```

## ambient declaration for custom notifications

```ts
import type { ToastPluginAPI, CustomMethods } from 'vue-toastify';

declare module 'vue-toastify' {
    interface MyMethods extends CustomMethods {
        authenticationError(): string;
    }

    function useToast(): ToastPluginAPI & MyMethods;
}

```
