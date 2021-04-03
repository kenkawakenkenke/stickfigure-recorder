const functions = require("firebase-functions");
const firebase = require('firebase-admin');
firebase.initializeApp(functions.config().firebase)
const exampleRecording = require('./exampleRecording.json');

const { handleRecording, initGifUploader } = require("./gif_uploader.js");

const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '1GB'
};

exports.renderGif = functions
    .region("asia-northeast1")
    .runWith(runtimeOpts)
    .https.onRequest(async (req, res) => {
        await initGifUploader();

        const recording = exampleRecording;
        const addToGallery = false;
        const doUpload = false;

        const storage = firebase.storage();
        const firestore = firebase.firestore();

        const response = await handleRecording(storage, firestore, recording, addToGallery, doUpload);
        console.log(response);

        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(response.buffer);
    });

exports.uploadGifRecording = functions
    .region("asia-northeast1")
    .runWith(runtimeOpts)
    .https.onCall(async (data, context) => {
        await initGifUploader();

        // Params
        const recording = data.recording;
        const addToGallery = data.addToGallery;
        const doUpload = true;

        const storage = firebase.storage();
        const firestore = firebase.firestore();

        const response = await handleRecording(storage, firestore, recording, addToGallery, doUpload);
        console.log("saved", response.url);
        return response;
    });
