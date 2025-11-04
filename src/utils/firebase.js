// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKgkA34fFmFZN3xNnp7RXWtMo-PO-KKf4",
  authDomain: "parkz-f1bd0.firebaseapp.com",
  projectId: "parkz-f1bd0",
  storageBucket: "parkz-f1bd0.appspot.com",
  messagingSenderId: "825115203554",
  appId: "1:825115203554:web:efafc259732630490c8bbb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
