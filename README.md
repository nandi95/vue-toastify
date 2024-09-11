## <p align="center">🔥Vue Toastify🔥</p>
<p align="center">Simple and dependency free notification plugin.</p>

## Installation

```bash
npm i vue-toastify
```

```ts
import { createApp } from 'vue';
import plugin from 'vue-toastify';
// base styles
import 'vue-toastify/index.css';
// theme styles
import 'vue-toastify/themes/dark.css';
import type { Settings } from 'vue-toastify';

const app = createApp({  });
app.use<Settings>(plugin, {  });
app.mount('#app');
```

[Usage with Nuxt](#usage-with-nuxt)

## Options:
 - [ToastOptions](src/type.ts#L174) - settings per toast
 - [Settings](src/type.ts#L96) - global settings (default settings [here](src/composables/useSettings.ts#L7))
 - [ToastPluginAPI](src/composables/useToast.ts#L13) - methods available on the `useToast()` composable
 - [Events](src/composables/useVtEvents.ts#L6) - events emitted by the plugin

## Custom styling
Styles include a `'dark'`(default) and a `'light'` theme. If you would like to create your own styles you may use the following helpers:

```ts
import { createVtTheme, getCssRules } from 'vue-toastify';

// this will create a stylesheet if doesn't exists and insert it into the head
createVtTheme('myThemeName', '#8f6b42');
// then you can set the theme of the status or the global settings
// alternatively, you can get an array of css rules using getCssRules
getCssRules('myThemeName', '#8f6b42').forEach(rule => {...});
// this will give you a good starting point to customise the theme
```

## Custom notifications
You may create some methods on the `useToast()` so it will shortcut any repetition you may have in your app. To register them add a `customNotifications` key to the settings when registering the plugin.

```ts
app.use<Settings>(plugin, {
    customNotifications: {
        authenticationError: {
            body: 'Authentication error',
            // ... rest of the toast options here
        }
    }
});
// then later you can use it as
useToast().authenticationError();
```

## Ambient declaration for custom notifications

```ts
import type { ToastPluginAPI, CustomMethods } from 'vue-toastify';

declare module 'vue-toastify' {
    interface MyMethods extends CustomMethods {
        authenticationError(): string;
    }

    function useToast(): ToastPluginAPI & MyMethods;
}
```

## Events
The plugin emits events that you can listen to which allows for using callbacks at different points in the toast's lifecycle.

```ts
import { useVtEvents, useToast } from 'vue-toastify';

const toast = useToast().success({ body: 'Hello world', canTimeout: true });

useVtEvents().once('vtPaused', payload => {
    if (payload.id === toast.id) {
        // do something
    }
})
```

### Usage with Nuxt
The recommended way to install is by creating a plugin. As notifications are expected to be responses to user actions, we can lazy load the plugin to reduce the initial bundle size.

Be sure
to familiarise yourself with the [Nuxt plugin documentation](https://nuxt.com/docs/guide/directory-structure/plugins).

```ts
// plugins/toast.client.ts
// .client will only run the plugin on the client side.
import type { Settings } from 'vue-toastify';

export default defineNuxtPlugin({
    name: 'toast',
    // can load the same time as the rest of the plugins
    parallel: true,
    setup: nuxt => {
        // this will lazy load the plugin therefore won't be included in the entry point
        void import('vue-toastify').then(exports => {
            nuxt.vueApp.use<Settings>(exports.default, {
                pauseOnHover: true,
                theme: 'light',
                position: 'top-right'
            });
        });
    }
});

```
Then specify the auto-imported preset in your configuration.
```ts
// nuxt.config.ts
export default defineNuxtConfig({
    css: [
        // required base themes
        'vue-toastify/index.css',
        // include the theme you want to use
        'vue-toastify/themes/light.css'
        // or generate one of your own as described in the custom styling section
    ],
    imports: {
        // this will include the composables that the plugin provides
        // which is negligable in size compared to the plugin itself
        presets: [
            {
                from: 'vue-toastify',
                imports: [
                    // include only the composables you need auto-imported
                    'useToast',
                    // 'useVtEvents',
                    // 'useVtSettings'
                ]
            }
        ]
    },
})
```
