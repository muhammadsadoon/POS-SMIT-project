// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "saylani-fullstack-pos-project.firebaseapp.com",
  projectId: "saylani-fullstack-pos-project",
  storageBucket: "saylani-fullstack-pos-project.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_API_MESSAGES_SENDER_ID,
  appId: process.env.FIREBASE_API_APP_ID,
  measurementId: "G-Y4K92RLKV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);