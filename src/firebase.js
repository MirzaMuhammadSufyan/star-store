import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDeYpQDX8a7Rt-j_5t8BdWX4jC3eRNJh9g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "star-store-77521.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "star-store-77521",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "star-store-77521.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "60182804335",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:60182804335:web:0a112df3586df907e81a9a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-E4D974F9DR",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export default app;
