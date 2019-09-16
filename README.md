# Vue Toastify [![Netlify Status](https://api.netlify.com/api/v1/badges/bc0cc717-a41e-4317-85d5-bc0ba745b3a5/deploy-status)](https://app.netlify.com/sites/vue-toastify/deploys)

**Fuss free notification component.**

I wanted a component which I can use by passing props from the server on the first paint but which can also take statuses at run time. With this component it's has just become super easy.

Check it out at [Netlify](https://vue-toastify.netlify.com/)


**To Install:**

```
npm i vue-toastify
```

**To Use:**

1| Import the component:

```
import VueToastify from 'vue-toastify';
```
or with CDNs:
 - [jsDeliver](https://cdn.jsdelivr.net/npm/vue-toastify@latest)
 - [unpkg](https://unpkg.com/vue-toastify@0.4.0/dist/vue-toastify.umd.min.js)

2|  Register the component with Vue:

```
Vue.component('vue-toastify', VueToastify);
```

3| Add it inside your application:

```
<vue-toastify :your-props="here"></vue-toastify>
``` 

4| Call it from the script:

```
EventBus.$emit('vtNotify', statusObject);
```
###### _For more elaborate example, see the site's code_

**Props**
-
 prop | type | default | details |
---|---|---|---
| status | Object | null | Not required, you may just let the component listen for future statuses. |
| canPause | Boolean | false | Enables pausing of the loader and the timeout on hover. |
| defaultTitle | Boolean | true | Enables the fallback to the type as the title. |
| eventHandler | String | "EventBus" | This entity will handle the events eg.: Eventbus.$on('vtNotify', ...) |
| lightTheme | Boolean | false | Change to the light theme. |
| withBackdrop | Boolean | false | Add backdrop. |
| errorDuration | Number | 8000 | The duration in milliseconds the error notification should be visible for. |
| successDuration | Number | 4000 | The duration in milliseconds the error notification should be visible for. |
| alertInfoDuration | Number | 6000 | The duration in milliseconds the error notification should be visible for. |
| initialDelay | Number | 750 | If a status passed as a prop, it may starts the script before the page's content fully loaded. With this you can specify delay in milliseconds for the initial notification. |
| bodyMaxWidth | Number | 250 | Maximum width the body can take up. in px The rest of the notification will always be the same width. |
| position|String|"bottom-right"| Controls where the notification should appear. Accepted values are: 'top-left', 'top-center', 'top-right', 'left-center', 'right-center', 'bottom-left',  'bottom-center', 'bottom-right'. (when using centered positions the manual displacement will not work for the axis it's centered on)|
| positionXDistance | String | "10px" | Distance from the left or right depending on the position prop. All css values are accepted. |
| positionYDistance | String | "10px" | Distance from the top or bottom depending on the position prop. All css values are accepted. |

*The status object takes the following attributes:*
 - *body = this is binded using v-html so you can go crazy with it*
 - *(optional) title = if left empty, the type will be set as the title (first letter will always be capitalized)*
 - *(optional) type =  accepted values are: 'success', 'alert', 'info', 'error'. If no type given, it falls back to info*
 - *(optional) canPause = you can overwrite what has already been set as
   a prop*
 - *(optional) canTimeout = if set to false the notification has to be dismissed manually, otherwise it defaults to true*
- *(optional) defaultTitle = should the title fall back to the type as the title*
- *(optional) duration = this will take priority over all other duration settings*
- *(optional) icon = you can customize the displayed icon within the circle using v-html*
- *(optional) mode = available modes: 'prompt' which will display a yes/no button by default and emits the vtPrompt event with the respective boolean value (canTimeout automatically gets disabled) or 'loader' which will stay present until it hears the vtLoaderStop event*
- *(optional) answers = a javascript object of answers eg.: { displayedValue: "emittedValue" }*

You may alternatively pass in an http error response.

**Miscellaneous info**
-
- Events:
  - To add an event at runtime, use the "vtNotify" event, passing the status object
  - Manually dismissing notification will emit the event "vtDismissed"
  - Timer events are triggered at the corresponding points: "vtStarted", "vtPaused", "vtResumed", "vtFinished"
  - Loader can be dismissed using the "vtLoadStop" event
  - Prompt on answer will emit the "vtPrompt" event with the defined answer

 - Pausing the notification is not supporting touch gestures but might work with long press on some devices.
 
  **1.0.0 will be released once the notification container has been added.**
 
**Todos**
-
 - Add a notification container which will enable displaying multiple notifications at the same time. (in progress)
    - queueing notification
 
- Add option that if url attribute specified on the status object, clicking on the notification
 will point the user to the url (SPA supported)

- Increase test coverage

- Remove core-js dependency

- Move the progress animation to use purely css

- Extract styles

- Add a method on the instance like `$this.vToastify.success(Object|String)` which returns a promise (in progress)

**Contribution**
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
