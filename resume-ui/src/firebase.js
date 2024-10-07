// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEVu0wF8w882ymguR-vi5kYBhf3HbbONU",
  authDomain: "auth-5b505.firebaseapp.com",
  projectId: "auth-5b505",
  storageBucket: "auth-5b505.appspot.com",
  messagingSenderId: "816275444904",
  appId: "1:816275444904:web:f5f133455fa866090d5e9d",
  measurementId: "G-3N07J812DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { app, auth, provider, signInWithPopup };
