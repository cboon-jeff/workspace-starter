/******/ var __webpack_modules__ = ({

/***/ "./client/src/framework/utils.ts":
/*!***************************************!*\
  !*** ./client/src/framework/utils.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatError: () => (/* binding */ formatError),
/* harmony export */   isBoolean: () => (/* binding */ isBoolean),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   isInteger: () => (/* binding */ isInteger),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   isStringValue: () => (/* binding */ isStringValue),
/* harmony export */   objectClone: () => (/* binding */ objectClone),
/* harmony export */   randomUUID: () => (/* binding */ randomUUID),
/* harmony export */   sanitizeString: () => (/* binding */ sanitizeString)
/* harmony export */ });
/**
 * Test if a value is a undefined or null.
 * @param value The value to test.
 * @returns True if the value is null or undefined.
 */
function isEmpty(value) {
    // eslint-disable-next-line no-restricted-syntax
    return value === undefined || value === null;
}
/**
 * Test if a value is an object.
 * @param value The value to test.
 * @returns True if the value is an object.
 */
function isObject(value) {
    // eslint-disable-next-line no-restricted-syntax
    return value !== undefined && value !== null && typeof value === "object";
}
/**
 * Test if a value is a string.
 * @param value The value to test.
 * @returns True if the value is a string.
 */
function isString(value) {
    // eslint-disable-next-line no-restricted-syntax
    return value !== undefined && value !== null && typeof value === "string";
}
/**
 * Test if a value is a string that is not empty.
 * @param value The value to test.
 * @returns True if the value is a string that is not empty.
 */
function isStringValue(value) {
    return isString(value) && value.trim().length > 0;
}
/**
 * Test if a value is a number.
 * @param value The value to test.
 * @returns True if the value is a number.
 */
function isNumber(value) {
    // eslint-disable-next-line no-restricted-syntax
    return value !== undefined && value !== null && typeof value === "number";
}
/**
 * Test if a value is a boolean.
 * @param value The value to test.
 * @returns True if the value is a boolean.
 */
function isBoolean(value) {
    // eslint-disable-next-line no-restricted-syntax
    return value !== undefined && value !== null && typeof value === "boolean";
}
/**
 * Test if a value is an integer.
 * @param value The value to test.
 * @returns True if the value is an integer.
 */
function isInteger(value) {
    return isNumber(value) && Number.isInteger(value);
}
/**
 * Deep clone an object.
 * @param obj The object to clone.
 * @returns The clone of the object.
 */
function objectClone(obj) {
    // eslint-disable-next-line no-restricted-syntax
    return obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
}
/**
 * Polyfills randomUUID if running in a non-secure context.
 * @returns The random UUID.
 */
function randomUUID() {
    if ("randomUUID" in window.crypto) {
        // eslint-disable-next-line no-restricted-syntax
        return window.crypto.randomUUID();
    }
    // Polyfill the window.crypto.randomUUID if we are running in a non secure context that doesn't have it
    // we are still using window.crypto.getRandomValues which is always available
    // https://stackoverflow.com/a/2117523/2800218
    /**
     * Get random hex value.
     * @param c The number to base the random value on.
     * @returns The random value.
     */
    function getRandomHex(c) {
        // eslint-disable-next-line no-bitwise
        const rnd = window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4));
        return (
        // eslint-disable-next-line no-bitwise
        (Number(c) ^ rnd).toString(16));
    }
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, getRandomHex);
}
/**
 * Format an error to a readable string.
 * @param err The error to format.
 * @returns The formatted error.
 */
function formatError(err) {
    if (err instanceof Error) {
        return err.message;
    }
    else if (typeof err === "string") {
        return err;
    }
    return JSON.stringify(err);
}
/**
 * A basic string sanitize function that removes angle brackets <> from a string.
 * @param content the content to sanitize
 * @returns a string without angle brackets <>
 */
function sanitizeString(content) {
    if (isString(content)) {
        return content.replace(/<[^>]*>?/gm, "");
    }
    return content;
}


/***/ }),

/***/ "./client/src/modules/lifecycle/example-notification-service/lifecycle.ts":
/*!********************************************************************************!*\
  !*** ./client/src/modules/lifecycle/example-notification-service/lifecycle.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExampleNotificationServiceProvider: () => (/* binding */ ExampleNotificationServiceProvider)
/* harmony export */ });
/* harmony import */ var workspace_platform_starter_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workspace-platform-starter/utils */ "./client/src/framework/utils.ts");

/**
 * Implementation for the example notification service lifecycle provider.
 */
class ExampleNotificationServiceProvider {
    /**
     * Initialize the module.
     * @param definition The definition of the module from configuration include custom options.
     * @param loggerCreator For logging entries.
     * @param helpers Helper methods for the module to interact with the application core.
     * @returns Nothing.
     */
    async initialize(definition, loggerCreator, helpers) {
        this._definition = definition;
        this._logger = loggerCreator(`ExampleNotificationService(${this._definition?.id}):`);
        this._helpers = helpers;
        this._lifeCycleSubscriptions = {};
        this._logger.info("Initializing");
    }
    /**
     * Close down any resources being used by the module.
     * @returns Nothing.
     */
    async closedown() {
        this._logger?.info("Closedown");
        // disconnect from websocket/server sent event source for example
        await this.stopNotificationService();
    }
    /**
     * Get the lifecycle events.
     * @returns The map of lifecycle events.
     */
    async get() {
        const lifecycleMap = {};
        lifecycleMap["after-bootstrap"] = async (platform, customData) => {
            await this.startNotificationService();
        };
        return lifecycleMap;
    }
    /**
     * Starts the notification service.
     */
    async startNotificationService() {
        const serverUrl = this._definition?.data?.exampleServerUrl;
        this._logger?.info(`Starting notification service and connecting to ${serverUrl ?? "https://examplenotificationserver"} (Not Really...this is an example.)`);
        if (this._helpers?.subscribeLifecycleEvent) {
            // we have been passed the ability to subscribe to lifecycle events.
            if (!this._lifeCycleSubscriptions) {
                this._lifeCycleSubscriptions = {};
            }
            if (!this._notificationSubscriptions) {
                this._notificationSubscriptions = {};
            }
            if (this._helpers?.getNotificationClient) {
                this._notificationClient = await this._helpers.getNotificationClient();
            }
            if (this._notificationClient) {
                await this.setupNotificationEventListeners();
                if (this._definition?.data?.notifyOn?.appsChanged !== false) {
                    const appsChangedSubscription = this._helpers?.subscribeLifecycleEvent("apps-changed", async () => {
                        const notification = {
                            title: "Apps Changed Notification",
                            body: `The list of apps on this platform has changed.This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
                            toast: "transient",
                            category: "default",
                            template: "markdown"
                        };
                        await this._notificationClient?.create(notification);
                    });
                    this._lifeCycleSubscriptions[appsChangedSubscription] = "apps-changed";
                }
                if (this._definition?.data?.notifyOn?.favoriteChanged !== false) {
                    const favoriteChangedSubscription = this._helpers?.subscribeLifecycleEvent("favorite-changed", async () => {
                        const notification = {
                            title: "Favorite Changed Notification",
                            body: `You have changed a favorite on this platform.This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
                            toast: "transient",
                            category: "default",
                            template: "markdown"
                        };
                        await this._notificationClient?.create(notification);
                    });
                    this._lifeCycleSubscriptions[favoriteChangedSubscription] = "favorite-changed";
                }
                if (this._definition?.data?.notifyOn?.pageChanged !== false) {
                    const pageChangedSubscription = this._helpers?.subscribeLifecycleEvent("page-changed", async () => {
                        const notification = {
                            title: "Page Changed Notification",
                            body: `You have changed the page on this platform.This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
                            toast: "transient",
                            category: "default",
                            template: "markdown"
                        };
                        await this._notificationClient?.create(notification);
                    });
                    this._lifeCycleSubscriptions[pageChangedSubscription] = "page-changed";
                }
                if (this._definition?.data?.notifyOn?.themeChanged !== false) {
                    const themeChangedSubscription = this._helpers?.subscribeLifecycleEvent("theme-changed", async () => {
                        const notification = {
                            title: "Theme Changed",
                            body: `You have changed the theme for this platform. This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
                            toast: "transient",
                            category: "default",
                            template: "markdown",
                            form: [
                                {
                                    type: "boolean",
                                    key: "intended theme change",
                                    label: "Did you intend to change the theme?",
                                    widget: {
                                        type: "Toggle"
                                    }
                                }
                            ],
                            buttons: [
                                {
                                    title: "Acknowledged",
                                    type: "button",
                                    cta: true,
                                    submit: true
                                }
                            ]
                        };
                        await this._notificationClient?.create(notification);
                    });
                    this._lifeCycleSubscriptions[themeChangedSubscription] = "theme-changed";
                }
                if (this._definition?.data?.notifyOn?.workspaceChanged !== false) {
                    const workspaceChangedSubscription = this._helpers?.subscribeLifecycleEvent("workspace-changed", async () => {
                        const notification = {
                            title: "Workspace Changed",
                            body: `You have changed your workspace. This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
                            toast: "transient",
                            category: "default",
                            template: "markdown",
                            buttons: [
                                {
                                    title: "Acknowledged",
                                    type: "button",
                                    cta: true,
                                    onClick: {
                                        task: "acknowledge-task",
                                        customData: {
                                            message: "This is the response data"
                                        }
                                    }
                                },
                                {
                                    title: "Cancel",
                                    type: "button"
                                }
                            ]
                        };
                        await this._notificationClient?.create(notification);
                    });
                    this._lifeCycleSubscriptions[workspaceChangedSubscription] = "workspace-changed";
                }
            }
        }
    }
    /**
     * Stops the notification service.
     */
    async stopNotificationService() {
        this._logger?.info("Stopping notification service (Not Really...this is an example.)");
        if (this._helpers?.unsubscribeLifecycleEvent && this._lifeCycleSubscriptions) {
            for (const [key, value] of Object.entries(this._lifeCycleSubscriptions)) {
                this._helpers.unsubscribeLifecycleEvent(key, value);
            }
        }
        await this.removeNotificationEventListeners();
    }
    /**
     * Setup listeners using the notification client fetched via a helper.
     */
    async setupNotificationEventListeners() {
        if (!(0,workspace_platform_starter_utils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(this._notificationClient) && !(0,workspace_platform_starter_utils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(this._notificationSubscriptions)) {
            const actionEventHandler = (event) => {
                this._logger?.info("Event for notification action received.", event);
            };
            await this._notificationClient.addEventListener("notification-action", actionEventHandler);
            this._notificationSubscriptions["notification-action"] = actionEventHandler;
            const closedEventHandler = (event) => {
                this._logger?.info("Event for notification closed received.", event);
            };
            await this._notificationClient.addEventListener("notification-closed", closedEventHandler);
            this._notificationSubscriptions["notification-closed"] = closedEventHandler;
            const createdEventHandler = (event) => {
                this._logger?.info("Event for notification created received.", event);
            };
            await this._notificationClient.addEventListener("notification-created", createdEventHandler);
            this._notificationSubscriptions["notification-created"] = createdEventHandler;
            const formSubmittedEventHandler = (event) => {
                this._logger?.info("Event for notification form submitted received.", event);
            };
            await this._notificationClient.addEventListener("notification-form-submitted", formSubmittedEventHandler);
            this._notificationSubscriptions["notification-form-submitted"] = formSubmittedEventHandler;
            const reminderCreatedEventHandler = (event) => {
                this._logger?.info("Event for notification reminder created received.", event);
            };
            await this._notificationClient.addEventListener("notification-reminder-created", reminderCreatedEventHandler);
            this._notificationSubscriptions["notification-reminder-created"] = reminderCreatedEventHandler;
            const reminderRemovedEventHandler = (event) => {
                this._logger?.info("Event for notification reminder removed received.", event);
            };
            await this._notificationClient.addEventListener("notification-reminder-removed", reminderRemovedEventHandler);
            this._notificationSubscriptions["notification-reminder-removed"] = reminderRemovedEventHandler;
            const toastDismissedEventHandler = (event) => {
                this._logger?.info("Event for notification toast dismissed received.", event);
            };
            await this._notificationClient.addEventListener("notification-toast-dismissed", toastDismissedEventHandler);
            this._notificationSubscriptions["notification-toast-dismissed"] = toastDismissedEventHandler;
            const notificationsCountChangedEventHandler = (event) => {
                this._logger?.info("Event for notification count changed received.", event);
            };
            await this._notificationClient.addEventListener("notifications-count-changed", notificationsCountChangedEventHandler);
            this._notificationSubscriptions["notifications-count-changed"] = notificationsCountChangedEventHandler;
        }
    }
    /**
     * Clean up notification subscriptions.
     */
    async removeNotificationEventListeners() {
        if (!(0,workspace_platform_starter_utils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(this._notificationClient) && !(0,workspace_platform_starter_utils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(this._notificationSubscriptions)) {
            for (const [key, value] of Object.entries(this._notificationSubscriptions)) {
                await this._notificationClient.removeEventListener(key, value);
            }
        }
    }
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************************************************!*\
  !*** ./client/src/modules/lifecycle/example-notification-service/index.ts ***!
  \****************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   entryPoints: () => (/* binding */ entryPoints)
/* harmony export */ });
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lifecycle */ "./client/src/modules/lifecycle/example-notification-service/lifecycle.ts");

/**
 * Define the entry points for the module.
 */
const entryPoints = {
    lifecycle: new _lifecycle__WEBPACK_IMPORTED_MODULE_0__.ExampleNotificationServiceProvider()
};

})();

var __webpack_exports__entryPoints = __webpack_exports__.entryPoints;
export { __webpack_exports__entryPoints as entryPoints };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS1ub3RpZmljYXRpb24tc2VydmljZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSSxTQUFTLE9BQU8sQ0FBQyxLQUFjO0lBQ3JDLGdEQUFnRDtJQUNoRCxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQztBQUM5QyxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNJLFNBQVMsUUFBUSxDQUFDLEtBQWM7SUFDdEMsZ0RBQWdEO0lBQ2hELE9BQU8sS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNJLFNBQVMsUUFBUSxDQUFDLEtBQWM7SUFDdEMsZ0RBQWdEO0lBQ2hELE9BQU8sS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNJLFNBQVMsYUFBYSxDQUFDLEtBQWM7SUFDM0MsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSSxTQUFTLFFBQVEsQ0FBQyxLQUFjO0lBQ3RDLGdEQUFnRDtJQUNoRCxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7QUFDM0UsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSSxTQUFTLFNBQVMsQ0FBQyxLQUFjO0lBQ3ZDLGdEQUFnRDtJQUNoRCxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxTQUFTLENBQUM7QUFDNUUsQ0FBQztBQUVEOzs7O0dB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QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLHlFQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEVBQUU7WUFDcEYsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEVBQUU7Z0JBQzNFLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixDQUNqRCxHQUFrQyxFQUNsQyxLQUFjLENBQ2QsQ0FBQzthQUNGO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7Ozs7Ozs7U0M5V0Q7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ0xpRTtBQUVqRTs7R0FFRztBQUNJLE1BQU0sV0FBVyxHQUFxRDtJQUM1RSxTQUFTLEVBQUUsSUFBSSwwRUFBa0MsRUFBRTtDQUNuRCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb3BlbmZpbi13b3Jrc3BhY2UtLXdvcmtzcGFjZS1wbGF0Zm9ybS1zdGFydGVyLy4vY2xpZW50L3NyYy9mcmFtZXdvcmsvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vb3BlbmZpbi13b3Jrc3BhY2UtLXdvcmtzcGFjZS1wbGF0Zm9ybS1zdGFydGVyLy4vY2xpZW50L3NyYy9tb2R1bGVzL2xpZmVjeWNsZS9leGFtcGxlLW5vdGlmaWNhdGlvbi1zZXJ2aWNlL2xpZmVjeWNsZS50cyIsIndlYnBhY2s6Ly9vcGVuZmluLXdvcmtzcGFjZS0td29ya3NwYWNlLXBsYXRmb3JtLXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3BlbmZpbi13b3Jrc3BhY2UtLXdvcmtzcGFjZS1wbGF0Zm9ybS1zdGFydGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vcGVuZmluLXdvcmtzcGFjZS0td29ya3NwYWNlLXBsYXRmb3JtLXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vcGVuZmluLXdvcmtzcGFjZS0td29ya3NwYWNlLXBsYXRmb3JtLXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vcGVuZmluLXdvcmtzcGFjZS0td29ya3NwYWNlLXBsYXRmb3JtLXN0YXJ0ZXIvLi9jbGllbnQvc3JjL21vZHVsZXMvbGlmZWN5Y2xlL2V4YW1wbGUtbm90aWZpY2F0aW9uLXNlcnZpY2UvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0IGlmIGEgdmFsdWUgaXMgYSB1bmRlZmluZWQgb3IgbnVsbC5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdC5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHZhbHVlIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwgfCB1bmRlZmluZWQge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcblx0cmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGw7XG59XG5cbi8qKlxuICogVGVzdCBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdC5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdC5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgb2JqZWN0IHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG5cdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn1cblxuLyoqXG4gKiBUZXN0IGlmIGEgdmFsdWUgaXMgYSBzdHJpbmcuXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB2YWx1ZSBpcyBhIHN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgc3RyaW5nIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG5cdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIjtcbn1cblxuLyoqXG4gKiBUZXN0IGlmIGEgdmFsdWUgaXMgYSBzdHJpbmcgdGhhdCBpcyBub3QgZW1wdHkuXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB2YWx1ZSBpcyBhIHN0cmluZyB0aGF0IGlzIG5vdCBlbXB0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nVmFsdWUodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBzdHJpbmcge1xuXHRyZXR1cm4gaXNTdHJpbmcodmFsdWUpICYmIHZhbHVlLnRyaW0oKS5sZW5ndGggPiAwO1xufVxuXG4vKipcbiAqIFRlc3QgaWYgYSB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdC5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBudW1iZXIge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcblx0cmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiO1xufVxuXG4vKipcbiAqIFRlc3QgaWYgYSB2YWx1ZSBpcyBhIGJvb2xlYW4uXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB2YWx1ZSBpcyBhIGJvb2xlYW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBib29sZWFuIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG5cdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCI7XG59XG5cbi8qKlxuICogVGVzdCBpZiBhIHZhbHVlIGlzIGFuIGludGVnZXIuXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgbnVtYmVyIHtcblx0cmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBEZWVwIGNsb25lIGFuIG9iamVjdC5cbiAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIFRoZSBjbG9uZSBvZiB0aGUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0Q2xvbmU8VD4ob2JqOiBUKTogVCB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuXHRyZXR1cm4gb2JqID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufVxuXG4vKipcbiAqIFBvbHlmaWxscyByYW5kb21VVUlEIGlmIHJ1bm5pbmcgaW4gYSBub24tc2VjdXJlIGNvbnRleHQuXG4gKiBAcmV0dXJucyBUaGUgcmFuZG9tIFVVSUQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21VVUlEKCk6IHN0cmluZyB7XG5cdGlmIChcInJhbmRvbVVVSURcIiBpbiB3aW5kb3cuY3J5cHRvKSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG5cdFx0cmV0dXJuIHdpbmRvdy5jcnlwdG8ucmFuZG9tVVVJRCgpO1xuXHR9XG5cdC8vIFBvbHlmaWxsIHRoZSB3aW5kb3cuY3J5cHRvLnJhbmRvbVVVSUQgaWYgd2UgYXJlIHJ1bm5pbmcgaW4gYSBub24gc2VjdXJlIGNvbnRleHQgdGhhdCBkb2Vzbid0IGhhdmUgaXRcblx0Ly8gd2UgYXJlIHN0aWxsIHVzaW5nIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHdoaWNoIGlzIGFsd2F5cyBhdmFpbGFibGVcblx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjMvMjgwMDIxOFxuXHQvKipcblx0ICogR2V0IHJhbmRvbSBoZXggdmFsdWUuXG5cdCAqIEBwYXJhbSBjIFRoZSBudW1iZXIgdG8gYmFzZSB0aGUgcmFuZG9tIHZhbHVlIG9uLlxuXHQgKiBAcmV0dXJucyBUaGUgcmFuZG9tIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0UmFuZG9tSGV4KGM6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2Vcblx0XHRjb25zdCBybmQgPSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJiAoMTUgPj4gKE51bWJlcihjKSAvIDQpKTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2Vcblx0XHRcdChOdW1iZXIoYykgXiBybmQpLnRvU3RyaW5nKDE2KVxuXHRcdCk7XG5cdH1cblx0cmV0dXJuIFwiMTAwMDAwMDAtMTAwMC00MDAwLTgwMDAtMTAwMDAwMDAwMDAwXCIucmVwbGFjZSgvWzAxOF0vZywgZ2V0UmFuZG9tSGV4KTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgYW4gZXJyb3IgdG8gYSByZWFkYWJsZSBzdHJpbmcuXG4gKiBAcGFyYW0gZXJyIFRoZSBlcnJvciB0byBmb3JtYXQuXG4gKiBAcmV0dXJucyBUaGUgZm9ybWF0dGVkIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RXJyb3IoZXJyOiB1bmtub3duKTogc3RyaW5nIHtcblx0aWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0cmV0dXJuIGVyci5tZXNzYWdlO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBlcnIgPT09IFwic3RyaW5nXCIpIHtcblx0XHRyZXR1cm4gZXJyO1xuXHR9XG5cdHJldHVybiBKU09OLnN0cmluZ2lmeShlcnIpO1xufVxuXG4vKipcbiAqIEEgYmFzaWMgc3RyaW5nIHNhbml0aXplIGZ1bmN0aW9uIHRoYXQgcmVtb3ZlcyBhbmdsZSBicmFja2V0cyA8PiBmcm9tIGEgc3RyaW5nLlxuICogQHBhcmFtIGNvbnRlbnQgdGhlIGNvbnRlbnQgdG8gc2FuaXRpemVcbiAqIEByZXR1cm5zIGEgc3RyaW5nIHdpdGhvdXQgYW5nbGUgYnJhY2tldHMgPD5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3RyaW5nKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG5cdGlmIChpc1N0cmluZyhjb250ZW50KSkge1xuXHRcdHJldHVybiBjb250ZW50LnJlcGxhY2UoLzxbXj5dKj4/L2dtLCBcIlwiKTtcblx0fVxuXHRyZXR1cm4gY29udGVudDtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9icmFjZS1zdHlsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LWZ1bmN0aW9uLXJldHVybi10eXBlICovXG5pbXBvcnQgdHlwZSB7IFdvcmtzcGFjZVBsYXRmb3JtTW9kdWxlIH0gZnJvbSBcIkBvcGVuZmluL3dvcmtzcGFjZS1wbGF0Zm9ybVwiO1xuaW1wb3J0IHR5cGUge1xuXHROb3RpZmljYXRpb25BY3Rpb25FdmVudCxcblx0Tm90aWZpY2F0aW9uQ2xvc2VkRXZlbnQsXG5cdE5vdGlmaWNhdGlvbkNyZWF0ZWRFdmVudCxcblx0Tm90aWZpY2F0aW9uRm9ybVN1Ym1pdHRlZEV2ZW50LFxuXHROb3RpZmljYXRpb25SZW1pbmRlckNyZWF0ZWRFdmVudCxcblx0Tm90aWZpY2F0aW9uUmVtaW5kZXJSZW1vdmVkRXZlbnQsXG5cdE5vdGlmaWNhdGlvblRvYXN0RGlzbWlzc2VkRXZlbnQsXG5cdE5vdGlmaWNhdGlvbnNDb3VudENoYW5nZWQsXG5cdE5vdGlmaWNhdGlvbk9wdGlvbnNcbn0gZnJvbSBcIkBvcGVuZmluL3dvcmtzcGFjZS9ub3RpZmljYXRpb25zXCI7XG5pbXBvcnQgdHlwZSB7XG5cdExpZmVjeWNsZSxcblx0TGlmZWN5Y2xlRXZlbnRNYXAsXG5cdExpZmVjeWNsZUV2ZW50c1xufSBmcm9tIFwid29ya3NwYWNlLXBsYXRmb3JtLXN0YXJ0ZXIvc2hhcGVzL2xpZmVjeWNsZS1zaGFwZXNcIjtcbmltcG9ydCB0eXBlIHsgTG9nZ2VyLCBMb2dnZXJDcmVhdG9yIH0gZnJvbSBcIndvcmtzcGFjZS1wbGF0Zm9ybS1zdGFydGVyL3NoYXBlcy9sb2dnZXItc2hhcGVzXCI7XG5pbXBvcnQgdHlwZSB7IE1vZHVsZURlZmluaXRpb24sIE1vZHVsZUhlbHBlcnMgfSBmcm9tIFwid29ya3NwYWNlLXBsYXRmb3JtLXN0YXJ0ZXIvc2hhcGVzL21vZHVsZS1zaGFwZXNcIjtcbmltcG9ydCB0eXBlIHtcblx0Tm90aWZpY2F0aW9uQ2xpZW50LFxuXHROb3RpZmljYXRpb25zRXZlbnRNYXBcbn0gZnJvbSBcIndvcmtzcGFjZS1wbGF0Zm9ybS1zdGFydGVyL3NoYXBlcy9ub3RpZmljYXRpb24tc2hhcGVzXCI7XG5pbXBvcnQgeyBpc0VtcHR5IH0gZnJvbSBcIndvcmtzcGFjZS1wbGF0Zm9ybS1zdGFydGVyL3V0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IEV4YW1wbGVOb3RpZmljYXRpb25TZXJ2aWNlUHJvdmlkZXJPcHRpb25zIH0gZnJvbSBcIi4vc2hhcGVzXCI7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gZm9yIHRoZSBleGFtcGxlIG5vdGlmaWNhdGlvbiBzZXJ2aWNlIGxpZmVjeWNsZSBwcm92aWRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEV4YW1wbGVOb3RpZmljYXRpb25TZXJ2aWNlUHJvdmlkZXJcblx0aW1wbGVtZW50cyBMaWZlY3ljbGU8RXhhbXBsZU5vdGlmaWNhdGlvblNlcnZpY2VQcm92aWRlck9wdGlvbnM+XG57XG5cdC8qKlxuXHQgKiBUaGUgbW9kdWxlIGRlZmluaXRpb24gaW5jbHVkaW5nIHNldHRpbmdzLlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHByaXZhdGUgX2RlZmluaXRpb246IE1vZHVsZURlZmluaXRpb248RXhhbXBsZU5vdGlmaWNhdGlvblNlcnZpY2VQcm92aWRlck9wdGlvbnM+IHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgbG9nZ2VyIGZvciBkaXNwbGF5aW5nIGluZm9ybWF0aW9uIGZyb20gdGhlIG1vZHVsZS5cblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwcml2YXRlIF9sb2dnZXI/OiBMb2dnZXI7XG5cblx0LyoqXG5cdCAqIEhlbHBlciBtZXRob2RzIGZvciB0aGUgbW9kdWxlLlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHByaXZhdGUgX2hlbHBlcnM6IE1vZHVsZUhlbHBlcnMgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIEFuIG9iamVjdCBjb250YWluaW5nIGN1cnJlbnQgc3Vic2NyaXB0aW9ucy5cblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwcml2YXRlIF9saWZlQ3ljbGVTdWJzY3JpcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IExpZmVjeWNsZUV2ZW50cyB9IHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBBbiBvYmplY3QgY29udGFpbmluZyBjdXJyZW50IHN1YnNjcmlwdGlvbnMuXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHJpdmF0ZSBfbm90aWZpY2F0aW9uU3Vic2NyaXB0aW9uczpcblx0XHR8IHsgW2tleSBpbiBrZXlvZiBOb3RpZmljYXRpb25zRXZlbnRNYXBdPzogKGV2ZW50OiBOb3RpZmljYXRpb25zRXZlbnRNYXBba2V5XSkgPT4gdm9pZCB9XG5cdFx0fCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIEEgbm90aWZpY2F0aW9uIGNsaWVudCBpZiBhdmFpbGFibGUuXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHJpdmF0ZSBfbm90aWZpY2F0aW9uQ2xpZW50OiBOb3RpZmljYXRpb25DbGllbnQgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIG1vZHVsZS5cblx0ICogQHBhcmFtIGRlZmluaXRpb24gVGhlIGRlZmluaXRpb24gb2YgdGhlIG1vZHVsZSBmcm9tIGNvbmZpZ3VyYXRpb24gaW5jbHVkZSBjdXN0b20gb3B0aW9ucy5cblx0ICogQHBhcmFtIGxvZ2dlckNyZWF0b3IgRm9yIGxvZ2dpbmcgZW50cmllcy5cblx0ICogQHBhcmFtIGhlbHBlcnMgSGVscGVyIG1ldGhvZHMgZm9yIHRoZSBtb2R1bGUgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgYXBwbGljYXRpb24gY29yZS5cblx0ICogQHJldHVybnMgTm90aGluZy5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBpbml0aWFsaXplKFxuXHRcdGRlZmluaXRpb246IE1vZHVsZURlZmluaXRpb248RXhhbXBsZU5vdGlmaWNhdGlvblNlcnZpY2VQcm92aWRlck9wdGlvbnM+LFxuXHRcdGxvZ2dlckNyZWF0b3I6IExvZ2dlckNyZWF0b3IsXG5cdFx0aGVscGVyczogTW9kdWxlSGVscGVyc1xuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLl9kZWZpbml0aW9uID0gZGVmaW5pdGlvbjtcblx0XHR0aGlzLl9sb2dnZXIgPSBsb2dnZXJDcmVhdG9yKGBFeGFtcGxlTm90aWZpY2F0aW9uU2VydmljZSgke3RoaXMuX2RlZmluaXRpb24/LmlkfSk6YCk7XG5cdFx0dGhpcy5faGVscGVycyA9IGhlbHBlcnM7XG5cdFx0dGhpcy5fbGlmZUN5Y2xlU3Vic2NyaXB0aW9ucyA9IHt9O1xuXHRcdHRoaXMuX2xvZ2dlci5pbmZvKFwiSW5pdGlhbGl6aW5nXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlIGRvd24gYW55IHJlc291cmNlcyBiZWluZyB1c2VkIGJ5IHRoZSBtb2R1bGUuXG5cdCAqIEByZXR1cm5zIE5vdGhpbmcuXG5cdCAqL1xuXHRwdWJsaWMgYXN5bmMgY2xvc2Vkb3duKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHRoaXMuX2xvZ2dlcj8uaW5mbyhcIkNsb3NlZG93blwiKTtcblx0XHQvLyBkaXNjb25uZWN0IGZyb20gd2Vic29ja2V0L3NlcnZlciBzZW50IGV2ZW50IHNvdXJjZSBmb3IgZXhhbXBsZVxuXHRcdGF3YWl0IHRoaXMuc3RvcE5vdGlmaWNhdGlvblNlcnZpY2UoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIGxpZmVjeWNsZSBldmVudHMuXG5cdCAqIEByZXR1cm5zIFRoZSBtYXAgb2YgbGlmZWN5Y2xlIGV2ZW50cy5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBnZXQoKTogUHJvbWlzZTxMaWZlY3ljbGVFdmVudE1hcD4ge1xuXHRcdGNvbnN0IGxpZmVjeWNsZU1hcDogTGlmZWN5Y2xlRXZlbnRNYXAgPSB7fTtcblxuXHRcdGxpZmVjeWNsZU1hcFtcImFmdGVyLWJvb3RzdHJhcFwiXSA9IGFzeW5jIChcblx0XHRcdHBsYXRmb3JtOiBXb3Jrc3BhY2VQbGF0Zm9ybU1vZHVsZSxcblx0XHRcdGN1c3RvbURhdGE/OiB1bmtub3duXG5cdFx0KTogUHJvbWlzZTx2b2lkPiA9PiB7XG5cdFx0XHRhd2FpdCB0aGlzLnN0YXJ0Tm90aWZpY2F0aW9uU2VydmljZSgpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gbGlmZWN5Y2xlTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB0aGUgbm90aWZpY2F0aW9uIHNlcnZpY2UuXG5cdCAqL1xuXHRwcml2YXRlIGFzeW5jIHN0YXJ0Tm90aWZpY2F0aW9uU2VydmljZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBzZXJ2ZXJVcmwgPSB0aGlzLl9kZWZpbml0aW9uPy5kYXRhPy5leGFtcGxlU2VydmVyVXJsO1xuXHRcdHRoaXMuX2xvZ2dlcj8uaW5mbyhcblx0XHRcdGBTdGFydGluZyBub3RpZmljYXRpb24gc2VydmljZSBhbmQgY29ubmVjdGluZyB0byAke1xuXHRcdFx0XHRzZXJ2ZXJVcmwgPz8gXCJodHRwczovL2V4YW1wbGVub3RpZmljYXRpb25zZXJ2ZXJcIlxuXHRcdFx0fSAoTm90IFJlYWxseS4uLnRoaXMgaXMgYW4gZXhhbXBsZS4pYFxuXHRcdCk7XG5cblx0XHRpZiAodGhpcy5faGVscGVycz8uc3Vic2NyaWJlTGlmZWN5Y2xlRXZlbnQpIHtcblx0XHRcdC8vIHdlIGhhdmUgYmVlbiBwYXNzZWQgdGhlIGFiaWxpdHkgdG8gc3Vic2NyaWJlIHRvIGxpZmVjeWNsZSBldmVudHMuXG5cdFx0XHRpZiAoIXRoaXMuX2xpZmVDeWNsZVN1YnNjcmlwdGlvbnMpIHtcblx0XHRcdFx0dGhpcy5fbGlmZUN5Y2xlU3Vic2NyaXB0aW9ucyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0aGlzLl9ub3RpZmljYXRpb25TdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRcdHRoaXMuX25vdGlmaWNhdGlvblN1YnNjcmlwdGlvbnMgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX2hlbHBlcnM/LmdldE5vdGlmaWNhdGlvbkNsaWVudCkge1xuXHRcdFx0XHR0aGlzLl9ub3RpZmljYXRpb25DbGllbnQgPSBhd2FpdCB0aGlzLl9oZWxwZXJzLmdldE5vdGlmaWNhdGlvbkNsaWVudCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50KSB7XG5cdFx0XHRcdGF3YWl0IHRoaXMuc2V0dXBOb3RpZmljYXRpb25FdmVudExpc3RlbmVycygpO1xuXG5cdFx0XHRcdGlmICh0aGlzLl9kZWZpbml0aW9uPy5kYXRhPy5ub3RpZnlPbj8uYXBwc0NoYW5nZWQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0Y29uc3QgYXBwc0NoYW5nZWRTdWJzY3JpcHRpb24gPSB0aGlzLl9oZWxwZXJzPy5zdWJzY3JpYmVMaWZlY3ljbGVFdmVudChcImFwcHMtY2hhbmdlZFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBcIkFwcHMgQ2hhbmdlZCBOb3RpZmljYXRpb25cIixcblx0XHRcdFx0XHRcdFx0Ym9keTogYFRoZSBsaXN0IG9mIGFwcHMgb24gdGhpcyBwbGF0Zm9ybSBoYXMgY2hhbmdlZC5UaGlzIHdhcyBnZW5lcmF0ZWQgYnkgdGhlIGV4YW1wbGUgbm90aWZpY2F0aW9uIHNlcnZpY2UgKG1vZHVsZUlkOiAke3RoaXMuX2RlZmluaXRpb24/LmlkfSkuYCxcblx0XHRcdFx0XHRcdFx0dG9hc3Q6IFwidHJhbnNpZW50XCIsXG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBcImRlZmF1bHRcIixcblx0XHRcdFx0XHRcdFx0dGVtcGxhdGU6IFwibWFya2Rvd25cIlxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuX25vdGlmaWNhdGlvbkNsaWVudD8uY3JlYXRlKG5vdGlmaWNhdGlvbik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5fbGlmZUN5Y2xlU3Vic2NyaXB0aW9uc1thcHBzQ2hhbmdlZFN1YnNjcmlwdGlvbl0gPSBcImFwcHMtY2hhbmdlZFwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX2RlZmluaXRpb24/LmRhdGE/Lm5vdGlmeU9uPy5mYXZvcml0ZUNoYW5nZWQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0Y29uc3QgZmF2b3JpdGVDaGFuZ2VkU3Vic2NyaXB0aW9uID0gdGhpcy5faGVscGVycz8uc3Vic2NyaWJlTGlmZWN5Y2xlRXZlbnQoXG5cdFx0XHRcdFx0XHRcImZhdm9yaXRlLWNoYW5nZWRcIixcblx0XHRcdFx0XHRcdGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb25PcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIkZhdm9yaXRlIENoYW5nZWQgTm90aWZpY2F0aW9uXCIsXG5cdFx0XHRcdFx0XHRcdFx0Ym9keTogYFlvdSBoYXZlIGNoYW5nZWQgYSBmYXZvcml0ZSBvbiB0aGlzIHBsYXRmb3JtLlRoaXMgd2FzIGdlbmVyYXRlZCBieSB0aGUgZXhhbXBsZSBub3RpZmljYXRpb24gc2VydmljZSAobW9kdWxlSWQ6ICR7dGhpcy5fZGVmaW5pdGlvbj8uaWR9KS5gLFxuXHRcdFx0XHRcdFx0XHRcdHRvYXN0OiBcInRyYW5zaWVudFwiLFxuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBcImRlZmF1bHRcIixcblx0XHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogXCJtYXJrZG93blwiXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuX25vdGlmaWNhdGlvbkNsaWVudD8uY3JlYXRlKG5vdGlmaWNhdGlvbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR0aGlzLl9saWZlQ3ljbGVTdWJzY3JpcHRpb25zW2Zhdm9yaXRlQ2hhbmdlZFN1YnNjcmlwdGlvbl0gPSBcImZhdm9yaXRlLWNoYW5nZWRcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLl9kZWZpbml0aW9uPy5kYXRhPy5ub3RpZnlPbj8ucGFnZUNoYW5nZWQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0Y29uc3QgcGFnZUNoYW5nZWRTdWJzY3JpcHRpb24gPSB0aGlzLl9oZWxwZXJzPy5zdWJzY3JpYmVMaWZlY3ljbGVFdmVudChcInBhZ2UtY2hhbmdlZFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBcIlBhZ2UgQ2hhbmdlZCBOb3RpZmljYXRpb25cIixcblx0XHRcdFx0XHRcdFx0Ym9keTogYFlvdSBoYXZlIGNoYW5nZWQgdGhlIHBhZ2Ugb24gdGhpcyBwbGF0Zm9ybS5UaGlzIHdhcyBnZW5lcmF0ZWQgYnkgdGhlIGV4YW1wbGUgbm90aWZpY2F0aW9uIHNlcnZpY2UgKG1vZHVsZUlkOiAke3RoaXMuX2RlZmluaXRpb24/LmlkfSkuYCxcblx0XHRcdFx0XHRcdFx0dG9hc3Q6IFwidHJhbnNpZW50XCIsXG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBcImRlZmF1bHRcIixcblx0XHRcdFx0XHRcdFx0dGVtcGxhdGU6IFwibWFya2Rvd25cIlxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuX25vdGlmaWNhdGlvbkNsaWVudD8uY3JlYXRlKG5vdGlmaWNhdGlvbik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5fbGlmZUN5Y2xlU3Vic2NyaXB0aW9uc1twYWdlQ2hhbmdlZFN1YnNjcmlwdGlvbl0gPSBcInBhZ2UtY2hhbmdlZFwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX2RlZmluaXRpb24/LmRhdGE/Lm5vdGlmeU9uPy50aGVtZUNoYW5nZWQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGhlbWVDaGFuZ2VkU3Vic2NyaXB0aW9uID0gdGhpcy5faGVscGVycz8uc3Vic2NyaWJlTGlmZWN5Y2xlRXZlbnQoXG5cdFx0XHRcdFx0XHRcInRoZW1lLWNoYW5nZWRcIixcblx0XHRcdFx0XHRcdGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb25PcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIlRoZW1lIENoYW5nZWRcIixcblx0XHRcdFx0XHRcdFx0XHRib2R5OiBgWW91IGhhdmUgY2hhbmdlZCB0aGUgdGhlbWUgZm9yIHRoaXMgcGxhdGZvcm0uIFRoaXMgd2FzIGdlbmVyYXRlZCBieSB0aGUgZXhhbXBsZSBub3RpZmljYXRpb24gc2VydmljZSAobW9kdWxlSWQ6ICR7dGhpcy5fZGVmaW5pdGlvbj8uaWR9KS5gLFxuXHRcdFx0XHRcdFx0XHRcdHRvYXN0OiBcInRyYW5zaWVudFwiLFxuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBcImRlZmF1bHRcIixcblx0XHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogXCJtYXJrZG93blwiLFxuXHRcdFx0XHRcdFx0XHRcdGZvcm06IFtcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGtleTogXCJpbnRlbmRlZCB0aGVtZSBjaGFuZ2VcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IFwiRGlkIHlvdSBpbnRlbmQgdG8gY2hhbmdlIHRoZSB0aGVtZT9cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2lkZ2V0OiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJUb2dnbGVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdFx0XHRidXR0b25zOiBbXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIkFja25vd2xlZGdlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImJ1dHRvblwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjdGE6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN1Ym1pdDogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50Py5jcmVhdGUobm90aWZpY2F0aW9uKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHRoaXMuX2xpZmVDeWNsZVN1YnNjcmlwdGlvbnNbdGhlbWVDaGFuZ2VkU3Vic2NyaXB0aW9uXSA9IFwidGhlbWUtY2hhbmdlZFwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX2RlZmluaXRpb24/LmRhdGE/Lm5vdGlmeU9uPy53b3Jrc3BhY2VDaGFuZ2VkICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdGNvbnN0IHdvcmtzcGFjZUNoYW5nZWRTdWJzY3JpcHRpb24gPSB0aGlzLl9oZWxwZXJzPy5zdWJzY3JpYmVMaWZlY3ljbGVFdmVudChcblx0XHRcdFx0XHRcdFwid29ya3NwYWNlLWNoYW5nZWRcIixcblx0XHRcdFx0XHRcdGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb25PcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIldvcmtzcGFjZSBDaGFuZ2VkXCIsXG5cdFx0XHRcdFx0XHRcdFx0Ym9keTogYFlvdSBoYXZlIGNoYW5nZWQgeW91ciB3b3Jrc3BhY2UuIFRoaXMgd2FzIGdlbmVyYXRlZCBieSB0aGUgZXhhbXBsZSBub3RpZmljYXRpb24gc2VydmljZSAobW9kdWxlSWQ6ICR7dGhpcy5fZGVmaW5pdGlvbj8uaWR9KS5gLFxuXHRcdFx0XHRcdFx0XHRcdHRvYXN0OiBcInRyYW5zaWVudFwiLFxuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBcImRlZmF1bHRcIixcblx0XHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogXCJtYXJrZG93blwiLFxuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbnM6IFtcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6IFwiQWNrbm93bGVkZ2VkXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYnV0dG9uXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGN0YTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0b25DbGljazoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhc2s6IFwiYWNrbm93bGVkZ2UtdGFza1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN1c3RvbURhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiVGhpcyBpcyB0aGUgcmVzcG9uc2UgZGF0YVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJDYW5jZWxcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJidXR0b25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50Py5jcmVhdGUobm90aWZpY2F0aW9uKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHRoaXMuX2xpZmVDeWNsZVN1YnNjcmlwdGlvbnNbd29ya3NwYWNlQ2hhbmdlZFN1YnNjcmlwdGlvbl0gPSBcIndvcmtzcGFjZS1jaGFuZ2VkXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU3RvcHMgdGhlIG5vdGlmaWNhdGlvbiBzZXJ2aWNlLlxuXHQgKi9cblx0cHJpdmF0ZSBhc3luYyBzdG9wTm90aWZpY2F0aW9uU2VydmljZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLl9sb2dnZXI/LmluZm8oXCJTdG9wcGluZyBub3RpZmljYXRpb24gc2VydmljZSAoTm90IFJlYWxseS4uLnRoaXMgaXMgYW4gZXhhbXBsZS4pXCIpO1xuXHRcdGlmICh0aGlzLl9oZWxwZXJzPy51bnN1YnNjcmliZUxpZmVjeWNsZUV2ZW50ICYmIHRoaXMuX2xpZmVDeWNsZVN1YnNjcmlwdGlvbnMpIHtcblx0XHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuX2xpZmVDeWNsZVN1YnNjcmlwdGlvbnMpKSB7XG5cdFx0XHRcdHRoaXMuX2hlbHBlcnMudW5zdWJzY3JpYmVMaWZlY3ljbGVFdmVudChrZXksIHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0YXdhaXQgdGhpcy5yZW1vdmVOb3RpZmljYXRpb25FdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHVwIGxpc3RlbmVycyB1c2luZyB0aGUgbm90aWZpY2F0aW9uIGNsaWVudCBmZXRjaGVkIHZpYSBhIGhlbHBlci5cblx0ICovXG5cdHByaXZhdGUgYXN5bmMgc2V0dXBOb3RpZmljYXRpb25FdmVudExpc3RlbmVycygpIHtcblx0XHRpZiAoIWlzRW1wdHkodGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50KSAmJiAhaXNFbXB0eSh0aGlzLl9ub3RpZmljYXRpb25TdWJzY3JpcHRpb25zKSkge1xuXHRcdFx0Y29uc3QgYWN0aW9uRXZlbnRIYW5kbGVyID0gKGV2ZW50OiBOb3RpZmljYXRpb25BY3Rpb25FdmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9sb2dnZXI/LmluZm8oXCJFdmVudCBmb3Igbm90aWZpY2F0aW9uIGFjdGlvbiByZWNlaXZlZC5cIiwgZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJub3RpZmljYXRpb24tYWN0aW9uXCIsIGFjdGlvbkV2ZW50SGFuZGxlcik7XG5cdFx0XHR0aGlzLl9ub3RpZmljYXRpb25TdWJzY3JpcHRpb25zW1wibm90aWZpY2F0aW9uLWFjdGlvblwiXSA9IGFjdGlvbkV2ZW50SGFuZGxlcjtcblxuXHRcdFx0Y29uc3QgY2xvc2VkRXZlbnRIYW5kbGVyID0gKGV2ZW50OiBOb3RpZmljYXRpb25DbG9zZWRFdmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9sb2dnZXI/LmluZm8oXCJFdmVudCBmb3Igbm90aWZpY2F0aW9uIGNsb3NlZCByZWNlaXZlZC5cIiwgZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJub3RpZmljYXRpb24tY2xvc2VkXCIsIGNsb3NlZEV2ZW50SGFuZGxlcik7XG5cdFx0XHR0aGlzLl9ub3RpZmljYXRpb25TdWJzY3JpcHRpb25zW1wibm90aWZpY2F0aW9uLWNsb3NlZFwiXSA9IGNsb3NlZEV2ZW50SGFuZGxlcjtcblxuXHRcdFx0Y29uc3QgY3JlYXRlZEV2ZW50SGFuZGxlciA9IChldmVudDogTm90aWZpY2F0aW9uQ3JlYXRlZEV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMuX2xvZ2dlcj8uaW5mbyhcIkV2ZW50IGZvciBub3RpZmljYXRpb24gY3JlYXRlZCByZWNlaXZlZC5cIiwgZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJub3RpZmljYXRpb24tY3JlYXRlZFwiLCBjcmVhdGVkRXZlbnRIYW5kbGVyKTtcblx0XHRcdHRoaXMuX25vdGlmaWNhdGlvblN1YnNjcmlwdGlvbnNbXCJub3RpZmljYXRpb24tY3JlYXRlZFwiXSA9IGNyZWF0ZWRFdmVudEhhbmRsZXI7XG5cblx0XHRcdGNvbnN0IGZvcm1TdWJtaXR0ZWRFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IE5vdGlmaWNhdGlvbkZvcm1TdWJtaXR0ZWRFdmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9sb2dnZXI/LmluZm8oXCJFdmVudCBmb3Igbm90aWZpY2F0aW9uIGZvcm0gc3VibWl0dGVkIHJlY2VpdmVkLlwiLCBldmVudCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRhd2FpdCB0aGlzLl9ub3RpZmljYXRpb25DbGllbnQuYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0XCJub3RpZmljYXRpb24tZm9ybS1zdWJtaXR0ZWRcIixcblx0XHRcdFx0Zm9ybVN1Ym1pdHRlZEV2ZW50SGFuZGxlclxuXHRcdFx0KTtcblx0XHRcdHRoaXMuX25vdGlmaWNhdGlvblN1YnNjcmlwdGlvbnNbXCJub3RpZmljYXRpb24tZm9ybS1zdWJtaXR0ZWRcIl0gPSBmb3JtU3VibWl0dGVkRXZlbnRIYW5kbGVyO1xuXG5cdFx0XHRjb25zdCByZW1pbmRlckNyZWF0ZWRFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IE5vdGlmaWNhdGlvblJlbWluZGVyQ3JlYXRlZEV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMuX2xvZ2dlcj8uaW5mbyhcIkV2ZW50IGZvciBub3RpZmljYXRpb24gcmVtaW5kZXIgY3JlYXRlZCByZWNlaXZlZC5cIiwgZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50LmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdFwibm90aWZpY2F0aW9uLXJlbWluZGVyLWNyZWF0ZWRcIixcblx0XHRcdFx0cmVtaW5kZXJDcmVhdGVkRXZlbnRIYW5kbGVyXG5cdFx0XHQpO1xuXHRcdFx0dGhpcy5fbm90aWZpY2F0aW9uU3Vic2NyaXB0aW9uc1tcIm5vdGlmaWNhdGlvbi1yZW1pbmRlci1jcmVhdGVkXCJdID0gcmVtaW5kZXJDcmVhdGVkRXZlbnRIYW5kbGVyO1xuXG5cdFx0XHRjb25zdCByZW1pbmRlclJlbW92ZWRFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IE5vdGlmaWNhdGlvblJlbWluZGVyUmVtb3ZlZEV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMuX2xvZ2dlcj8uaW5mbyhcIkV2ZW50IGZvciBub3RpZmljYXRpb24gcmVtaW5kZXIgcmVtb3ZlZCByZWNlaXZlZC5cIiwgZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50LmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdFwibm90aWZpY2F0aW9uLXJlbWluZGVyLXJlbW92ZWRcIixcblx0XHRcdFx0cmVtaW5kZXJSZW1vdmVkRXZlbnRIYW5kbGVyXG5cdFx0XHQpO1xuXHRcdFx0dGhpcy5fbm90aWZpY2F0aW9uU3Vic2NyaXB0aW9uc1tcIm5vdGlmaWNhdGlvbi1yZW1pbmRlci1yZW1vdmVkXCJdID0gcmVtaW5kZXJSZW1vdmVkRXZlbnRIYW5kbGVyO1xuXG5cdFx0XHRjb25zdCB0b2FzdERpc21pc3NlZEV2ZW50SGFuZGxlciA9IChldmVudDogTm90aWZpY2F0aW9uVG9hc3REaXNtaXNzZWRFdmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9sb2dnZXI/LmluZm8oXCJFdmVudCBmb3Igbm90aWZpY2F0aW9uIHRvYXN0IGRpc21pc3NlZCByZWNlaXZlZC5cIiwgZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgdGhpcy5fbm90aWZpY2F0aW9uQ2xpZW50LmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdFwibm90aWZpY2F0aW9uLXRvYXN0LWRpc21pc3NlZFwiLFxuXHRcdFx0XHR0b2FzdERpc21pc3NlZEV2ZW50SGFuZGxlclxuXHRcdFx0KTtcblx0XHRcdHRoaXMuX25vdGlmaWNhdGlvblN1YnNjcmlwdGlvbnNbXCJub3RpZmljYXRpb24tdG9hc3QtZGlzbWlzc2VkXCJdID0gdG9hc3REaXNtaXNzZWRFdmVudEhhbmRsZXI7XG5cblx0XHRcdGNvbnN0IG5vdGlmaWNhdGlvbnNDb3VudENoYW5nZWRFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IE5vdGlmaWNhdGlvbnNDb3VudENoYW5nZWQpID0+IHtcblx0XHRcdFx0dGhpcy5fbG9nZ2VyPy5pbmZvKFwiRXZlbnQgZm9yIG5vdGlmaWNhdGlvbiBjb3VudCBjaGFuZ2VkIHJlY2VpdmVkLlwiLCBldmVudCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRhd2FpdCB0aGlzLl9ub3RpZmljYXRpb25DbGllbnQuYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0XCJub3RpZmljYXRpb25zLWNvdW50LWNoYW5nZWRcIixcblx0XHRcdFx0bm90aWZpY2F0aW9uc0NvdW50Q2hhbmdlZEV2ZW50SGFuZGxlclxuXHRcdFx0KTtcblx0XHRcdHRoaXMuX25vdGlmaWNhdGlvblN1YnNjcmlwdGlvbnNbXCJub3RpZmljYXRpb25zLWNvdW50LWNoYW5nZWRcIl0gPSBub3RpZmljYXRpb25zQ291bnRDaGFuZ2VkRXZlbnRIYW5kbGVyO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhbiB1cCBub3RpZmljYXRpb24gc3Vic2NyaXB0aW9ucy5cblx0ICovXG5cdHByaXZhdGUgYXN5bmMgcmVtb3ZlTm90aWZpY2F0aW9uRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0aWYgKCFpc0VtcHR5KHRoaXMuX25vdGlmaWNhdGlvbkNsaWVudCkgJiYgIWlzRW1wdHkodGhpcy5fbm90aWZpY2F0aW9uU3Vic2NyaXB0aW9ucykpIHtcblx0XHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuX25vdGlmaWNhdGlvblN1YnNjcmlwdGlvbnMpKSB7XG5cdFx0XHRcdGF3YWl0IHRoaXMuX25vdGlmaWNhdGlvbkNsaWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuXHRcdFx0XHRcdGtleSBhcyBrZXlvZiBOb3RpZmljYXRpb25zRXZlbnRNYXAsXG5cdFx0XHRcdFx0dmFsdWUgYXMgbmV2ZXJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHR5cGUgeyBNb2R1bGVJbXBsZW1lbnRhdGlvbiwgTW9kdWxlVHlwZXMgfSBmcm9tIFwid29ya3NwYWNlLXBsYXRmb3JtLXN0YXJ0ZXIvc2hhcGVzL21vZHVsZS1zaGFwZXNcIjtcbmltcG9ydCB7IEV4YW1wbGVOb3RpZmljYXRpb25TZXJ2aWNlUHJvdmlkZXIgfSBmcm9tIFwiLi9saWZlY3ljbGVcIjtcblxuLyoqXG4gKiBEZWZpbmUgdGhlIGVudHJ5IHBvaW50cyBmb3IgdGhlIG1vZHVsZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGVudHJ5UG9pbnRzOiB7IFt0eXBlIGluIE1vZHVsZVR5cGVzXT86IE1vZHVsZUltcGxlbWVudGF0aW9uIH0gPSB7XG5cdGxpZmVjeWNsZTogbmV3IEV4YW1wbGVOb3RpZmljYXRpb25TZXJ2aWNlUHJvdmlkZXIoKVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==