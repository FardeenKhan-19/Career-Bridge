import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Import getStorage

const firebaseConfig = {
    apiKey: "AIzaSyC2ETklkpW0ci9Mtrg_xAufEFBt-Sc6VXw",
    authDomain: "career-bridge-456d6.firebaseapp.com",
    projectId: "career-bridge-456d6",
    storageBucket: "career-bridge-456d6.firebasestorage.app",
    messagingSenderId: "681101500410",
    appId: "1:681101500410:web:cab9468650cfbbe4cace43",
    measurementId: "G-2N4E0GW06X"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // 2. Initialize Storage

export { auth, db, storage }; // 3. Export storage

