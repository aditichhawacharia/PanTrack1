// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwu2MlzQqIfOc61bNNHyyQpVkCnWR3VK4",
    authDomain: "stock-sync-offbeats.firebaseapp.com",
    projectId: "stock-sync-offbeats",
    storageBucket: "stock-sync-offbeats.appspot.com",
    messagingSenderId: "855943906143",
    appId: "1:855943906143:web:05a27f07174691b2c12cea",
    measurementId: "G-22CW2HZ97B"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

// Export the firebase database
export { firestore, analytics};