// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB9AJQ6s6G6Q4bHWZErmgRVlT__c0mha-4",
    authDomain: "my-how-to.firebaseapp.com",
    projectId: "my-how-to",
    storageBucket: "my-how-to.appspot.com",
    messagingSenderId: "419876880037",
    appId: "1:419876880037:web:27ebbd89d0d76a6255174c",
    measurementId: "G-DN62GE0PGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });