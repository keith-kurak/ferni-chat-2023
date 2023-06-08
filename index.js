// This is the first file that ReactNative will run when it starts up.
// If you use Expo (`yarn expo:start`), the entry point is ./App.js instead.
// Both do essentially the same thing.

import App from "./app/app.tsx"
import React from "react"
import { AppRegistry } from "react-native"

function IgniteApp() {
  return <App hideSplashScreen={true} />
}

AppRegistry.registerComponent("FerniChat2023Final", () => IgniteApp)
export default App
