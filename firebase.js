// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKWIuVYoq-RivLKaMWhZ8CJFJzZ19sv40",
  authDomain: "ai-flashcard-31610.firebaseapp.com",
  projectId: "ai-flashcard-31610",
  storageBucket: "ai-flashcard-31610.appspot.com",
  messagingSenderId: "994682561247",
  appId: "1:994682561247:web:eca1614865a2590cb23f6a",
  measurementId: "G-3HPMWRLX30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);