const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gif-encoder-2");
const common = require("stickfigurecommon");

// console.log(common.Painter.Items.StopSignIcon);
// loadImage(common.Painter.Items.StopSignIcon)
// loadImage("../stickfigurecommon/imgs/stopsign.svg")
// .then(img => console.log(img));

// console.log(common.Painter.Items.StopSignIcon);
(async () => {

    await common.Painter.init((image, callback) => {
        loadImage(decodeURIComponent(image)).then(loadedImage => {
            callback(loadedImage);
        });
    });

    const recording = JSON.parse(fs.readFileSync("exampleRecording.json"));

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
        common.Painter.paintFrame(ctx, frame);
        // ctx.drawImage(img, 0, 0);
        // console.log("Items:", common.Painter);
        // console.log(common.Icons.StopSignIcon);
        // add an image element
        encoder.addFrame(ctx);
    };
    encoder.finish();
    const outImage = encoder.out.getData();

    fs.writeFileSync("/Users/ken/Desktop/out.gif", outImage);

})();