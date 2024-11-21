// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgTFGLVQdvf24pEKpwBfwmA1JpY0QWojQ",
  authDomain: "laser-cut-d8f38.firebaseapp.com",
  projectId: "laser-cut-d8f38",
  storageBucket: "laser-cut-d8f38.appspot.com",
  messagingSenderId: "516323200601",
  appId: "1:163232006051:web:2dbb72d98008c604a4e416",
  measurementId: "G-0BMMXDXL2G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, db };
