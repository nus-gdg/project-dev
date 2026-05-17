// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAD08IWwZi0woyFwMXFH2LtVeva6ELPhjg",
  authDomain: "project-dev-ccc26.firebaseap p.com",
  projectId: "project-dev-ccc26",
  storageBucket: "project-dev-ccc26.firebasestorage.app",
  messagingSenderId: "951463095169",
  appId: "1:951463095169:web:8a8fcc2bb48092f51c9680",
  measurementId: "G-ZH58G833Y5"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);    // default bucket
