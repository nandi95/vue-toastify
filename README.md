# Vue Toastify

**Fuss free notification component.**

I wanted a notification plugin which I can use by passing props from the server and it can also take statuses at run time. With this component it's has just become super easy.

Check it out at [Netlify](https://vue-toastify.netlify.com/)


**To use:**

```
npm i vue-toastify
```
or with CDNs:
 - [jsDeliver](https://cdn.jsdelivr.net/npm/vue-toastify@latest)
 - [unpkg](https://unpkg.com/vue-toastify@1.0.0/dist/vue-toastify.umd.min.js)
 
 ***

In your main js file:

```
Vue.use(VueToastify);
```
 Then anywhere just call:
```
this.vToastify.success("easy-peasy");
```

**Settings**
-
You may pass a settings object to the use statement like so:

```
Vue.use(VueToastify, {
    my: "settings"
});
```
or change any of the settings during run-time with the following
 
```
this.vToastify.setSettings(settingsObject);
```

**Available settings**

 setting | type | default | details |
---|---|---|---
| singular | Boolean | false | Only allow one notification on the screen at a time, others will be queued up for showing later. |
| withBackdrop | Boolean | false | Enables backdrop to be shown. |
| backdrop | String | "rgba(0, 0, 0, 0.2)" | The rgba value for the backdrop. |
| position | String | "bottom-right" | Defines where the notifications should be showing on the screen. Available values are: `"top-left"`, `"top-center"`, `"top-right"`, `"center-left"`, `"center-center"`, `"center-right"`, `"bottom-left"`, `"bottom-center"`, `"bottom-right"` |
| errorDuration | Number | 8000 | The duration in milliseconds the error notification should be visible for. |
| successDuration | Number | 4000 | The duration in milliseconds the success notification should be visible for. |
| alertInfoDuration | Number | 6000 | The duration in milliseconds the alert and info notification should be visible for. |
| canTimeout | Boolean | true | Whether the notifications disappears after the set time. |
| canPause | Boolean | true | Whether the notifications can be paused by hovering over them. |
| defaultTitle | Boolean | true | Whether a default title should be shown if no title is supplied. |

**Status**
-
You can pass to the functions either a string for the body of the status and optionally a title for the second argument like so:
```
this.vToastify.error("body", "title"); 
```
Or pass an object to the method:
```
this.vToastify.info(stausObject);
```
The following properties can be set on the object:

 property | type  | details |
---|---|---
| body | String | Required parameter, you may pass html to this. |
| title | String | Enables pausing of the loader and the timeout on hover. |
| type | String | Defines what notification type should be showing available types: `"success"`, `"alert"`, `"info"`, `"error"` defaults to `"success"`. Alternatively you may use the methods: `this.vToastify.alert("more readable")` |
| url | String  | If set, clicking on the notification will take the user to the given location (does not support vue router yet) |

You may additionally overwrite the plugin settings on a notification by notification basis.

 property | type  | details |
---|---|---
| canTimeout | Boolean | Whether the notifications disappear after the set time. |
| canPause | Boolean | Whether the notifications can be paused by hovering over them. |
| duration | Number | The time the notification is displayed in milliseconds. |
| defaultTitle | Boolean | Overwrites the globally set setting. |

You may alternatively pass in an http error response like:
```
fetch().then().catch(error => this.vtNotify(error));
```
***
Every call notification method returns a unique id associated to your notification object.
 
Additional methods
=
**The notification supports multiple modes**

You can either pass the `mode` property on the status object which is one of the following strings: `"prompt"`, `"loader"` or by calling:
```
this.vToastify.loader("Please Wait...")
```
```
this.vToastify.prompt({
    body: "Are there hot singles in your area?"
    answers: { Yes: true, No: false }
})
```
The prompt does not return an id instead it returns a Promise so may use it as:
```
...}).then(value => {
    if (value) {
        this.vToastify.prompt({
            body: "Is it a scam?"
            answers: { Yes: true, No: false }
        })
        .then(value => console.log(value ? "Yay!" : "Nay"))
    }
})
```
The answers object consist of a key value pairs in the object where the key is displayed to the user and the value returned by the promise.

**Additional methods available:**

A loader cannot be dismissed, you'll have to stop the loader yourself like so:
```
this.vToastify.stopLoader(id)
```
This will stops the loader with the given id. If no id provided, all loaders will be closed.


For returning a notification object use:
```
this.vToastify.getToast(id)
```
This if found returns the notification object otherwise all of the notification objects in an array.

For updating the notification object during run-time use:
```
this.vToastify.changeToast(id, statusObject)
```
This will merge the object you pass in and the existing notification. It will return true on success and false if the notification isn't found.

For removing a notification use:
```
this.vToastify.removeToast(id)
```
This will remove the notification if the id is given otherwise it will remove all of the notifications. The function returns the ids of the currently visible notifications.
***
To pass a notification from the server, assign your notification to `window.notification` before importing the other scripts. On mount this will gets displayed to the user. If this notification object has a property called `delay`, the notification display will be delayed by the given number of milliseconds.

**Miscellaneous info**
-
 - Pausing the notification is not supporting touch gestures but might work with long press on some devices.
 
**Todos**
-
- Option for showing one type at a time.

- Increase test coverage

- Remove core-js dependency

- Add touch swipe gestures

- Create php library for fluently setting the initial notification

- Move animation to purely css with animation-play-state

- Re-write in TypeScript and use the vue core's `validateProps()`, rewrite for vue 3

- Get url props on the answers object for redirecting on click of button

- Make styles customizable

**Alternatives**
-
[Vue Snotify](https://artemsky.github.io/vue-snotify/)
