## <p align="center">🔥Vue Toastify🔥</p>
<p align="center">Simple and dependency free notification plugin.</p>

## install

```bash
npm i vue-toastify
```

```ts
import { createApp } from 'vue';
import plugin from 'vue-toastify';
import 'vue-toastify/index.css';
import type { Settings } from 'vue-toastify';

const app = createApp({  });
app.use<Settings>(plugin, {  });
app.mount('#app');
```

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
