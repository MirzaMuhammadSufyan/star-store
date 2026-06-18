import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeYpQDX8a7Rt-j_5t8BdWX4jC3eRNJh9g",
  authDomain: "star-store-77521.firebaseapp.com",
  projectId: "star-store-77521",
  storageBucket: "star-store-77521.firebasestorage.app",
  messagingSenderId: "60182804335",
  appId: "1:60182804335:web:0a112df3586df907e81a9a",
  measurementId: "G-E4D974F9DR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
