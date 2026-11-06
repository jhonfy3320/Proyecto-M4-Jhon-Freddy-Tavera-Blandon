// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVqoH2LTx7S3JTWzWQmLYNaBwAn0mxbn0",
  authDomain: "m4jhon-freddy-tavera-blandon.firebaseapp.com",
  projectId: "m4jhon-freddy-tavera-blandon",
  storageBucket: "m4jhon-freddy-tavera-blandon.firebasestorage.app",
  messagingSenderId: "315673795416",
  appId: "1:315673795416:web:a3b236958b9f1e8cb5e32d",
  measurementId: "G-B1DXVFS2SP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);