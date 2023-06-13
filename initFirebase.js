// paste firebase code here
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // ..
};

// Initialize Firebase
initializeApp(firebaseConfig);

// you could put your firebase init inside the function, but it doesn't matter a whole lot
// we just need an excuse to import this file.
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default initFirebase = () => {};