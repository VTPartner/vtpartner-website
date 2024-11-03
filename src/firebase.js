/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithPhoneNumber,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD0xKIqgSp-rxnfVBG00cUTNxaUlCPuAs",
  authDomain: "vt-partner-4a2b1.firebaseapp.com",
  projectId: "vt-partner-4a2b1",
  storageBucket: "vt-partner-4a2b1.firebasestorage.app",
  messagingSenderId: "1046135317601",
  appId: "1:1046135317601:web:d67f42c5990b18bfe07620",
  measurementId: "G-88M7BTM15M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth, PhoneAuthProvider, signInWithPhoneNumber };
