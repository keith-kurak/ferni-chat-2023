# Interlude: Development Builds
## Goal
Expo Go has its limits. Let's future-proof with a dev build.
A dev build is like your own personal version of Expo Go. It lets you launch JS from your local development environment, but is customized to your native runtime.
## Useful info
- [Development Builds documentation](https://docs.expo.dev/develop/development-builds/use-development-builds/)
## How-to
1. Run `eas init`
2. Run `eas build:configure`
3. Run `npx expo install expo-dev-client`
4. Run `eas build --profile development --platform <ios|android>`
5. Wait for the build to be done, and install!
6. Run with `npx expo start --dev-client`

## Notes
### Simulator builds
If you want to build for an ios simulator, you'll need a separate **eas.json** build profile. You can make one like this:
```json
"development-simulator": {
  "extends": "development",
  "ios": {
    "simulator": true
  }
}
```

### iOS device ad-hoc provisioning
You can run `eas device:create` to generate a link you can use to add other iOS devices to your app, and then when you build an "internal" distribution build for iOS devices, those devices will be added to the provisioning profile, meaning they can run the app.