// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCinUNIxeIHsOfVWPjYt6CT6oCRGoe_dLw",
  authDomain: "social-media-clone-a8ce0.firebaseapp.com",
  projectId: "social-media-clone-a8ce0",
  storageBucket: "social-media-clone-a8ce0.appspot.com",
  messagingSenderId: "648206617035",
  appId: "1:648206617035:web:a9b4179cf49b6dbd5bce4e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestoreDB = getFirestore();
