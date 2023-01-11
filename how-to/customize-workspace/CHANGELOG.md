# Changelog

## v10

- Added support for new themes format with light and dark schemes
  - toolbar button icons should now use `{theme}` and `{scheme}` substitution in icon url instead of `themes` property
  - dock button icons can also use the `{theme}` and `{scheme}` syntax
  - added `theme-changed` life cycle event
- Added example of using setSearchQuery API for home integration
- Use Notifications now uses Show/Hide APIs instead of toggle
- Shim randomUUID so that it can be used in non secure contexts
- Added ability to restrict who can connect to your broker and the ability to specify how a payload is validated (which endpoint to use). See [how to manage connections to your platform](./docs/how-to-manage-connections-to-your-platform.md).
- Added ability to collect analytic events generated by the workspace and workspace platform through configuration. See [how to configure analytics](./docs/how-to-configure-analytics.md)
- Added example of splitting initial auth into a shell that only has required logic (in case you want access to the main provider bundle limited until authentication has been performed). The fourth manifest provides an example of this.
- Added example of extending the App definition in order to keep compatibility with Workspace components while also proving data specific to a platform implementation. App definition now has an optional private setting. When set to true the app will no longer show up in Home, Store or Dock but can still be launched via fdc3/interop.
- Add source filter to home with Apps, Pages, Workspaces and integration modules
- Added opinionated support for fdc3.open (see [How To Add Open Support To Your App](./docs/how-to-add-open-support-to-your-app.md))
- Updated example auth to give an example of how workspace can present entitled based data by letting you pick from two users and each user has a role (developer or sales) and the developer role has an apps feed that consists of developer related apps and has menu options that help developers (inspect view, window, platform etc) where as the sales role keeps the demo apps but filters out developer related menu options and apps. **npm run secondclient** will run the demo.
- Moved the create app definition action logic from the app definition module (which has been deleted) into a developer action module which also has inspect menu actions.
- Added ability to specify a minimum and/or maximum version for something your platform depends on (see [How To Add Version Support](./docs/how-to-add-versioning-support.md))
- Moved the workspaces home logic into the Workspaces integration provider
- Moved the pages home logic into the Pages integration provider
- Removed `enableWorkspaceIntegration` from `homeProvider`, enable/disable the Workspaces integration instead
- Removed `enablePageIntegration` from `homeProvider`, enable/disable the Pages integration instead

## v9.2

- Added `dev` npm script which live build and reloads code for customize-workspace sample
- Added `dispatchFocusEvents: true` to Home provider so integrations should handle `result.action.trigger === "user-action"` to activate entries

## v9.1

- Removed `GETALL` from endpoints to make it behave more like REST, instead use `GET` without an `id` which returns the whole object, not as an array, but as a keyed object
- Add initOptions lifecycle property which defaults to `after-bootstrap`, but has an alternative value of `after-auth`
- Change - headless windows initialization to be towards the end of the bootstrapper instead of before the platform is initialized (allowing windows to be launched after workspace registration is successful).
- Added - an extra check to the fdc3 1.2 mapper to check to see if tags are passed (not part of the 1.2 spec but if they exist they should be used) and if no tags are passed we then use the manifest type as a tag.

## v9

- Added - Lifecycle modules with standard hooks of `after-bootstrap`, `before-quit`
- Added - Condition modules
- Change - Menu entries use `conditions` to determine visibility
- Change - The `sharing` option has been moved from `bootstrapProvider` to `platformProvider` in `customSettings`
- Change - The `conditions.isAuthenticationEnabled` flag has changed to `conditions: ["authenticated"]`
- Added - The toolbar buttons can be enabled/disabled with conditions
- Change - Code folders have been rationalized into `framework\platform`, `framework\shapes`, `framework\workspace`
- Added - `bootstrapProvider.autoShow` now has `none` option to not launch any of the standard components, can be used if you want to hook the life-cycle event if `after-bootstrap` and show you own view
- Fixed - Menu entry incorrectly positioned elements marked as `before`
- Fixed - Modules with multiple entry points correctly handle separate configurations
- Removed - Browser page bound storage no longer has a fallback if the storage endpoint is not configured
- Fixed - Platform overrides quit behavior if called during a snapshot load
- Change - Authentication example uses RegExp match for `authenticatedUrl` instead of exact match
- Fixed - Authentication example used correct `logoutUrl` when determining if it can call logout
- Change - Example modules reference the types using a local namespace `customize-workspace` instead of relative paths
- Added - `package.json` has additional script command `generate-types` which can be used to generate a folder of TypeScript type definitions `.d.ts` files for the shapes, the types can imported when building modules instead of needing to reference the framework directly