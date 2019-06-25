# Vue Toastify

**Fuss free notification component.**

I wanted a component which I can use by passing props from the server on the first paint but which can also take statuses at run time. With this component it's super easy and it can also be paused.


**To Install:**

```
npm i vue-toastify
```

**To Use:**

1. Import the component:

```
import VueToastify from 'vue-toastify';
```

2.  register the component with Vue
```
Vue.component('VueToastify', VueToastify);
```
3. add it inside your application
```
<VueToastify :your-props="here" />
``` 
**Props:**
-

 prop | type | default | details 
---|---|---|---
status | Object | null | Not required, you may just let the component listen for future statuses.
canPause|Boolean|false|Enables pausing of the loader and the timeout on hover.
defaultTitle | Boolean | true | Enables the fallback to the type as the title.
 eventHandler | String | "EventBus" | This entity will handle the events eg.: Eventbus.$on('notify', ...)
 eventName | String | "notify" | The event the handler will listen for.
 lightTheme | Boolean | false | Change to the light theme.
 errorDuration | Number | 8000 | The duration in milliseconds the error notification should be visible for.
 successDuration | Number | 4000 | The duration in milliseconds the error notification should be visible for.
 alertInfoDuration | Number | 6000 | The duration in milliseconds the error notification should be visible for.
 delay | Number | 750 | If a status passed as a prop, it may already starts the script before the page's content fully loaded. With this you can specify delay in milliseconds the initial notification.
 bodyMaxWidth | Number | 250 | Maximum width the body can take up. The rest of the notification will always be the same width.
position|String|"bottom-right"| Controls where the notification should appear. Accepted values are: 'top-left', 'top-right', 'bottom-left', 'bottom-right'.
positionXDistance|String|"10px"| Distance from the left or right depending on the position prop. All css values are accepted.
positionYDistance|String|"10px"| Distance from the top or bottom depending on the position prop. All css values are accepted.



*The status object takes the following attributes:*
 - *body = this is binded using v-html so you can go crazy with it*
 - *(optional) title = if left empty, the type will be set as the title (first letter will always be capitalized)*
 - *(optional) type =  accepted values are: 'success', 'alert', 'info', 'error'. If no type given, it falls back to info*
 - *(optional) canPause = you can overwrite what has already been set as
   a prop*
 - *(optional) canTimeout = if set to false the notification has to be dismissed manually, otherwise it defaults to true.*
- *(optional) defaultTitle = you can overwrite what has already been set as
      a prop*
- *(optional) duration = this will take priority over all other duration settings*
- *(optional) icon = you can customize the displayed icon within the circle using v-html*

**Miscellaneous info:**
-
- Events:
  - Manually dismissing notification will emit the event "notificationDismissed"
  - Timer events are triggered at the corresponding points: "notificationStarted", "notificationPaused", "notificationResumed", "notificationFinished"

 - Pausing the notification is not supporting touch gestures.
 
**Todos:**
-
 - Add a notification container which will enable displaying multiple notifications at the same time.
 
- Add option that if url attribute specified on the status object, clicking on the notification
 will point the user to the url (SPA supported)

- Increase test coverage

**Contribution:**
-
1. Fork the project
2. Set up project
    ```
    npm install
    ```
3. Compile and use hot-reloads for development
    ```
    npm run serve
    ```
4. Make your changes
5. Lint and fix the code
    ```
    npm run lint
    ```
6. Run your tests
    ```
    npm run test
    ```
7. Push to git and create a pull request.
