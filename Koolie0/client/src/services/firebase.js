// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8yn2W6TiKapE8Uw0igx3NNVFGhID9rMg",
  authDomain: "kooliedb.firebaseapp.com",
  projectId: "kooliedb",
  storageBucket: "kooliedb.appspot.com",
  messagingSenderId: "492632347787",
  appId: "1:492632347787:web:37280586d34d4533bf308e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
