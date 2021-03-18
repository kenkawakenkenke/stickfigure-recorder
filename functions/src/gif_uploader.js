const GIFEncoder = require('gif-encoder-2');
const common = require("stickfigurecommon");
const { createCanvas } = require('canvas');
const { v4: uuid } = require("uuid");

function renderToGif(recording) {
    const canvas = createCanvas(recording.exportWidth, recording.exportHeight);
    const ctx = canvas.getContext('2d')

    const drawWidth = recording.exportWidth;
    const drawHeight = recording.exportHeight;
    const encoder = new GIFEncoder(drawWidth, drawHeight);

    const delay = 1000 / recording.framerate;
    encoder.setDelay(delay);
    encoder.start();
    for (let index = recording.firstFrame; index < recording.lastFrame; index++) {
        const frame = recording.frames[index];
        common.paintFrame(ctx, frame);
        // add an image element
        encoder.addFrame(ctx);
    };
    encoder.finish();
    return encoder.out.getData()
}

async function uploadToBucket(storage, gifID, gifBuffer) {
    const bucketName = "stickfigure-public-gallery";
    const bucket = storage.bucket(bucketName);
    const imageFile = bucket.file(`${gifID}.gif`);
    const contentType = 'image/gif';
    await imageFile.save(gifBuffer, {
        // Really important, turning off gives huge boost in speed.
        resumable: false,
        public: true,
        contentType,
        metadata: {
            contentDisposition: "inline",
            cacheControl: "public, max-age=31536000",
        }
    });
    return imageFile.publicUrl();
}

async function doAddToGallery(firestore, gifID, recording, url) {
    await firestore.collection("gallery")
        .doc(gifID)
        .set({
            tCreated: new Date(),
            // For now, all uploads are anonymous.
            user: {},
            publicURL: url,
            image: {
                width: recording.exportWidth,
                height: recording.exportHeight,
                framerate: recording.framerate,
                numFrames: recording.lastFrame - recording.firstFrame,
            }
        });
}
async function handleRecording(storage, firestore, recording, addToGallery) {
    const buffer = renderToGif(recording);
    const gifID = uuid();
    const url = await uploadToBucket(storage, gifID, buffer);
    if (addToGallery) {
        doAddToGallery(firestore, gifID, recording, url);
    }
    return {
        url,
        gifID,
    };
}
module.exports = handleRecording;