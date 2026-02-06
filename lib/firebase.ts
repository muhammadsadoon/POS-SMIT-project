// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFU61bxvGXOkuBObySkgDmPOushdL7jUw",
  authDomain: "saylani-fullstack-pos-project.firebaseapp.com",
  projectId: "saylani-fullstack-pos-project",
  storageBucket: "saylani-fullstack-pos-project.firebasestorage.app",
  messagingSenderId: "640389103115",
  appId: "1:640389103115:web:eb4f0a0418db56a585110e",
  measurementId: "G-Y4K92RLKV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// firebase store (database)

const db = getFirestore(app);
const rtdb = getDatabase(app);
export {
  app,
  auth,
  db,
  rtdb,
}