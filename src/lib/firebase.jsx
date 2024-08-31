// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_API_KEY,
  authDomain: "chatp-b98ec.firebaseapp.com",
  projectId: "chatp-b98ec",
  storageBucket: "chatp-b98ec.appspot.com",
  messagingSenderId: "323664043161",
  appId: "1:323664043161:web:85cc2ebf3eb5a8e24bec08",
  measurementId: "G-XBM5LN6N2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth =getAuth()
export const db =getFirestore()
export const storage=getStorage()