// paste firebase code here
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from '@react-native-async-storage/async-storage';
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
const app = initializeApp(firebaseConfig);

const reactNativeLocalPersistence =
  getReactNativePersistence({
    getItem(...args) {
      // Called inline to avoid deprecation warnings on startup.
      return AsyncStorage.getItem(...args);
    },
    setItem(...args) {
      // Called inline to avoid deprecation warnings on startup.
      return AsyncStorage.setItem(...args);
    },
    removeItem(...args) {
      // Called inline to avoid deprecation warnings on startup.
      return AsyncStorage.removeItem(...args);
    },
  });

initializeAuth(app,
  {
    persistence: reactNativeLocalPersistence
  }
)

// you could put your firebase init inside the function, but it doesn't matter a whole lot
// we just need an excuse to import this file.
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default initFirebase = () => {};
