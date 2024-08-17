// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // If you plan to use Firebase Authentication
import { getAnalytics } from "firebase/analytics"; // Optional: if you need analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk21cGt7-ArR5N0btK5O7tupdFaLWkHjk",
  authDomain: "flashcardsaas-b8b6b.firebaseapp.com",
  projectId: "flashcardsaas-b8b6b",
  storageBucket: "flashcardsaas-b8b6b.appspot.com",
  messagingSenderId: "134423070973",
  appId: "1:134423070973:web:0814e44e384cef19a31694",
  measurementId: "G-R8R2CB9FY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Optional: Initialize Firebase Authentication if you need it
const auth = getAuth(app);

// Optional: Initialize Firebase Analytics if you need it
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export the initialized Firebase services for use in your app
export { db, auth, analytics };
