// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqnvF0lV_ycEzsdPN8O777-b7izP8E5bY",
  authDomain: "project-dev-2f2ff.firebaseapp.com",
  projectId: "project-dev-2f2ff",
  storageBucket: "project-dev-2f2ff.firebasestorage.app",
  messagingSenderId: "147952816511",
  appId: "1:147952816511:web:185dec87dd0ae115ab4a4a"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

