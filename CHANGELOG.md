**v1.4.0** */01/2020*
 
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
