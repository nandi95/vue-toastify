**v2.0.0** *10/09/2024*

Performance:
- ***BREAKING***: removed include of all styles by default. You now have to import the base styles **AND** the theme you want to use.
- Add `will-change` for transitioning toasts too.
- Added separate exports for composables.

Fix:
- Fixed toast might stay on screen if the duration is very low.

Chore:
- Fixed eslint issues.
- Updated dependencies.
- Updated demo app styling.
- Documented nuxt usage.

**v2.0.0-alpha** *13/04/2023*

Refactor:
- Rewritten codebase using v3 of Vue, and its composition api.
- Removed support for passing in router to the plugin. (Developer can just use the callback option)
- Added pauseOnFocusLoss option to pause the timer when the window loses focus.
- Added dynamic theme creation

**v1.8.1** *25/11/2021*

Fix:
- Resolved xss vulnerability stemming from an url option not being encoded (#26).

***

**v1.8.0** *05/05/2020*

 Feature:
 - Added a new event for when the notification is being dragged.
 - Drag event payloads now also include the position of the notification.
 - Added toastify to the vue as a static method for easier handling in vuex.

***

**v1.7.0** *28/03/2020*

 Feature:
 - Added vue router support to the `url` setting.
 - `getSettings()` can now return a single setting's value, given the key.

 Fix:
 - `changeToast` now returns `false` as expected when the toast isn't found.

***

*v1.6.1* *11/03/2020*

 Fix:
 - Drag behavior fixed to the toast not only the parent element.
 - Added will change optimisation to dragging.

***

**v1.6.0** *10/03/2020*

 Feature:
 - Added one type at a time option.
 - Added max number of notifications on screen option.
 - Added `getSettings()` function. (This is more verbose than `setSettings({})`)

 Fix:
 - Concatenated queue with toasts on `getToast` and added return value on not found.
 - Fixed positioning of the toast on singular dismiss
 - Fixed `stopLoader` when passed an array of ids

***

*v1.5.2* *20/01/2020*

 Fix:
 - Fixed width issue with long content on leave transition.

***

*v1.5.1* *20/01/2020*

 Fix:
 - Added extra check for icon selection.

***

**v1.5.0** *19/01/2020*

 Fix:
 - Added the return statement to the custom notification methods
 - Fixed the setSettings when using with falsy value.
 - Added logic to delay the notification move on removal
 - Fixed transition positions
 - Added more style namespaces and a whitelist pattern

 Feature:
 - Added draggable option to dismiss toast by dragging.
 - Added function to listen for events emitted by the notifications.

***

**v1.4.0** *03/01/2020*

 Fix:
 - Removed bodyMaxWidth from props and added to the styles
 - Updated adding feature to return id instead of currently showing toasts if it is in singular mode.
 - Removed prototype builtins.
 - Added missing checks for notification coming from server.
 - Added packages for testing.
 - Styling adjustment for the notification content

 Feature:
 - Added sass functions for easier theme creation
 - Added option for accepting icons in object format

***

*v1.3.1* *27/12/2019*

 Fix:
 - Removed polyfills from bundle

***

**v1.3.0** *27/12/2019*

 Fix:
 - Container now ignores clicks thanks to `pointer-events: none;`
 - Better responsiveness added to the toasts
 - Fixed notification timeout close logic
 - General refactor for maintainability
 - The status' title attribute will no longer get capitalised (Sorry I didn't see major bump version justified)

 Feature:
 - Moved transition into group transition for using the FLIP technique
 - Added notification display ordering option
 - Plugin now accepts custom transitions

***
