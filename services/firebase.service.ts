// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase } from 'firebase/database'
import { getAuth, } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey:  "AIzaSyDLi7oFpn3niaWH3hP7e6CgFbR3HxCm1FU",
    authDomain:  "myshinee-brasil.firebaseapp.com",
    projectId:  "myshinee-brasil",
    storageBucket:  "myshinee-brasil.appspot.com",
    messagingSenderId:  "445312604373",
    appId:  "1:445312604373:web:4bc9a9fb1ba287a0c5ea5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fbauth = getAuth(app);
const fbrtdb = getDatabase(app)

export {
    fbrtdb,
    fbauth
}

