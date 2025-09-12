// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2ETklkpW0ci9Mtrg_xAufEFBt-Sc6VXw",
    authDomain: "career-bridge-456d6.firebaseapp.com",
    projectId: "career-bridge-456d6",
    storageBucket: "career-bridge-456d6.firebasestorage.app",
    messagingSenderId: "681101500410",
    appId: "1:681101500410:web:cab9468650cfbbe4cace43",
    measurementId: "G-2N4E0GW06X"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in other parts of your app
export const auth = getAuth(app);
export const db = getFirestore(app);