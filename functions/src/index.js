const functions = require("firebase-functions");
const firebase = require('firebase-admin');
firebase.initializeApp(functions.config().firebase)

const handleRecording = require("./gif_uploader.js");

exports.uploadGifRecording = functions
    .region("asia-northeast1")
    .https.onCall(async (data, context) => {
        // Params
        const recording = data.recording;
        const addToGallery = data.addToGallery;

        const storage = firebase.storage();
        const firestore = firebase.firestore();

        const url = await handleRecording(storage, firestore, recording, addToGallery);
        console.log("saved", url);
        return url;
    });
