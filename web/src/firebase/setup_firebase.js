import firebase from "firebase/app";
import "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBiBzeHgiC2nHzsxMKgWP0r58ODqh7rtnk",
    authDomain: "stickfigure-recorder.firebaseapp.com",
    projectId: "stickfigure-recorder",
    storageBucket: "stickfigure-recorder.appspot.com",
    messagingSenderId: "612021402305",
    appId: "1:612021402305:web:7dfe9f0bbe4406c2ab3240",
    measurementId: "G-6BDQNJ9VMV"
};
// Initialize Firebase
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}
firebase.analytics();
