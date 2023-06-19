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
  // ..
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
