//import * as firebase from "firebase";
import firebase from 'firebase';

const db = firebase.initializeApp ({
    apiKey: "AIzaSyB3Jv4gxiKpXejSWiYgBqVuHdFwiYvM7-s",
    authDomain: "mindparse-6a71f.firebaseapp.com",
    databaseURL: "https://mindparse-6a71f.firebaseio.com",
    projectId: "mindparse-6a71f",
    storageBucket: "mindparse-6a71f.appspot.com",
    messagingSenderId: "468958545650",
    appId: "1:468958545650:web:ec80a7541fe9c1448a726b",
    measurementId: "G-MDT1M7CNQM"
});

export const provider2 = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth;
export default db;