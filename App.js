// This is the entry point if you run `yarn expo:start`
// If you run `yarn ios` or `yarn android`, it'll use ./index.js instead.
import App from "./app/app.tsx"
import React from "react"
import { registerRootComponent } from "expo"
import { Platform } from "react-native"
import * as SplashScreen from "expo-splash-screen"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvhX36tCMwPddyAxMhV-L7ZIWts0Gz-as",
  authDomain: "ferni-chat-2023.firebaseapp.com",
  projectId: "ferni-chat-2023",
  storageBucket: "ferni-chat-2023.appspot.com",
  messagingSenderId: "1028596892424",
  appId: "1:1028596892424:web:2b318a5d42addddb9ae2bd",
  measurementId: "G-RJJXJJ4WB8"
};

// Initialize Firebase
initializeApp(firebaseConfig);

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

if (Platform.OS !== "web") {
  registerRootComponent(IgniteApp)
}

export default IgniteApp
