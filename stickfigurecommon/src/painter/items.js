import StopSignIcon from "../../imgs/stopsign.svg";

let initialized = false;
export async function init(imageLoader) {
    if (initialized) {
        return;
    }
    initialized = true;

    return new Promise(resolve => {
        imageLoader(StopSignIcon, image => {
            stopSignImage = image;
            resolve(image);
        });
    });
}

let stopSignImage;
export function getStopSignImage() {
    return stopSignImage;
}


// let stopSignImage;
// stopSignImage = new Image();
// // stopSignImage.onload = function () {
// //     ctx.drawImage(img, 0, 0);
// // }
// stopSignImage.src = StopSignIcon;//"imgs/stopsign.svg";
export { StopSignIcon };
