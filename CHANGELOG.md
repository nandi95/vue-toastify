
*v1.3.1* *20/01/2020*
 
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
