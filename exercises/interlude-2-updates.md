# Interlude: Updates
## Goal
Expo Go/ Development builds can also run JS published to the cloud- great for testing.
## Useful info
- [EAS Update docs](https://docs.expo.dev/eas-update/introduction/)
- [PR Review workflow with EAS Update](https://docs.expo.dev/eas-update/github-actions/#publish-previews-on-pull-requests)
## How-to
1. Run `eas init` (if you haven't already)
2. Run `eas update:configure`
3. Run `npx expo install expo-updates` (this is already done on the demo)
4. Run `eas update --channel preview`
5. Run the update link on your device, it should open in Expo Go or your development build.