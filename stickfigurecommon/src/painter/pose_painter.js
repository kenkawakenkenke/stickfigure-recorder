import { avgPosition, distBetween, extendPosition } from "../point_util.js";
// import StopSignIcon from "../imgs/stopsign.svg";
import * as Items from "./items.js";

let initialized = false;
async function init(imageLoader) {
    if (initialized) {
        return;
    }
    initialized = true;

    await Items.init(imageLoader);
}

export {
    init,
    Items
};

const segments = [
    {
        features: ["neck",
            "rightShoulder",
            "rightElbow", "rightWrist", "rightHand"],
    },
    {
        features: ["neck",
            "leftShoulder",
            "leftElbow", "leftWrist", "leftHand"],
    },
    {
        features: ["neck", "hip"],
    },
    {
        features: ["hip", "rightKnee", "rightAnkle", "rightFoot"],
    },
    {
        features: ["hip", "leftKnee", "leftAnkle", "leftFoot"],
    }
];

const debugSegments = [
    { features: ["leftEar", "headCenter", "rightEar", "nose", "leftEar"] },
    { features: ["nose", "leftEye", "leftEar"] },
    { features: ["nose", "rightEye", "rightEar"] },
    { features: ["nose", "neck"] },
    { features: ["leftShoulder", "neck", "rightShoulder"] },
    { features: ["leftShoulder", "leftElbow", "leftWrist", "leftHand"] },
    { features: ["rightShoulder", "rightElbow", "rightWrist", "rightHand"] },
    { features: ["leftShoulder", "leftHip", "hip"] },
    { features: ["rightShoulder", "rightHip", "hip"] },
    { features: ["neck", "hip"] },
    { features: ["leftHip", "leftKnee", "leftAnkle", "leftFoot"] },
    { features: ["rightHip", "rightKnee", "rightAnkle", "rightFoot"] },
];

const syntheticFeatureSpecs = [
    {
        part: "neck",
        dependencies: ["leftShoulder", "rightShoulder", "nose"],
        positionFunc:
            features =>
                avgPosition(
                    avgPosition(features["leftShoulder"].position, features["rightShoulder"].position),
                    features["nose"].position,
                    1 / 3),
    },
    {
        part: "headCenter",
        dependencies: ["nose", "leftEar", "rightEar"],
        positionFunc:
            features =>
                avgPosition(
                    avgPosition(features["leftEar"].position, features["rightEar"].position),
                    features["nose"].position),
    },
    {
        part: "hip",
        dependencies: ["leftHip", "rightHip"],
        positionFunc:
            features =>
                avgPosition(features["leftHip"].position, features["rightHip"].position)
    },
    {
        part: "leftHand",
        dependencies: ["leftElbow", "leftWrist"],
        positionFunc:
            features =>
                extendPosition(features["leftElbow"].position, features["leftWrist"].position, 0.25),
    },
    {
        part: "rightHand",
        dependencies: ["rightElbow", "rightWrist"],
        positionFunc:
            features =>
                extendPosition(features["rightElbow"].position, features["rightWrist"].position, 0.25),
    },
    {
        part: "leftFoot",
        dependencies: ["leftKnee", "leftAnkle"],
        positionFunc:
            features =>
                extendPosition(features["leftKnee"].position, features["leftAnkle"].position, 0.25),
    },
    {
        part: "rightFoot",
        dependencies: ["rightKnee", "rightAnkle"],
        positionFunc:
            features =>
                extendPosition(features["rightKnee"].position, features["rightAnkle"].position, 0.25),
    }
];

function addSyntheticFeatures(features) {
    syntheticFeatureSpecs.forEach(spec => {
        features[spec.part] = {
            part: spec.part,
            position: spec.positionFunc(features),
            score: spec.dependencies
                .map(dependency => features[dependency].score)
                .reduce((min, s) => Math.min(min, s), 1),
        };
    });
}

function drawCircle(ctx, point, radius, fillColor = "black") {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    // ctx.strokeText(text, wrist.position.x, wrist.position.y);
    ctx.fillStyle = fillColor;
    ctx.fill();
}
function drawLines(ctx, points, width, style = "black") {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.stroke();
}
function drawLine(ctx, fromPoint, toPoint, width) {
    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = width;
    ctx.stroke();
}
function drawText(ctx, point, text, fillColor = "black") {
    ctx.fillStyle = fillColor;
    ctx.fillText(text, point.x, point.y);
}

function paintPose(ctx, pose, toDrawPoint, toDrawScale, debugView = false) {
    const features =
        pose.keypoints.reduce((accum, c) => { accum[c.part] = c; return accum; }, {});
    addSyntheticFeatures(features);

    if (debugView) {
        const circleRadius = toDrawScale(5);
        Object.values(features)
            .map(feature => feature.position)
            .map(toDrawPoint)
            .forEach(p => {
                drawCircle(ctx, p, circleRadius, "red");
            });
        const lineWidth = toDrawScale(5);
        debugSegments.forEach(segment => {
            const points = segment.features
                .map(feature => features[feature].position)
                .map(toDrawPoint);
            drawLines(ctx, points, lineWidth, "#00ff00");
        });
        return;
    }

    const lineWidth = toDrawScale(20);
    segments.forEach(segment => {
        // Array of bools describing whether a feature in a segment has high enough quality.
        const qualityOK = segment.features.map(part => features[part].score > 0.5);
        let polyline = [];
        for (let i = 0; i < qualityOK.length; i++) {
            const ok =
                qualityOK[i]
                // Also allow points that are next to OK points.
                || (i > 0 && qualityOK[i - 1])
                || (i + 1 < qualityOK.length && qualityOK[i + 1]);
            if (ok) {
                polyline.push(toDrawPoint(features[segment.features[i]].position));
            } else {
                if (polyline.length >= 2) {
                    drawLines(ctx, polyline, lineWidth);
                }
                polyline = [];
            }
        }
        if (polyline.length >= 2) {
            drawLines(ctx, polyline, lineWidth);
        }
    });
    // Draw face
    drawCircle(ctx,
        toDrawPoint(features["headCenter"].position),
        Math.ceil(distBetween(toDrawPoint(features["headCenter"].position), toDrawPoint(features["neck"].position))));
}

// let stopSignImage;
// stopSignImage = new Image();
// // stopSignImage.onload = function () {
// //     ctx.drawImage(img, 0, 0);
// // }
// stopSignImage.src = StopSignIcon;//"imgs/stopsign.svg";
// export { stopSignImage };

function drawStopSign(ctx, canvasWidth, canvasHeight) {
    const padding = canvasWidth * 0.01;
    const signWidth = Math.min(canvasWidth, canvasHeight) - padding * 2;
    const img = Items.getStopSignImage();
    ctx.drawImage(img,
        (canvasWidth - signWidth) / 2,
        (canvasHeight - signWidth) / 2,
        signWidth, signWidth);
}

function drawItem(ctx, item, canvasWidth, canvasHeight) {
    switch (item.type) {
        case "stopsign":
            drawStopSign(ctx, canvasWidth, canvasHeight);
        default:
        // nope
    }
}

export function paintFrame(ctx, frame, backgroundOpacity = 1, debugView = false) {
    // Compute scaling
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    const videoWidth = frame.videoWidth;
    const videoHeight = frame.videoHeight;
    let xOffset = 0;
    let yOffset = 0;
    const videoWidthInDrawCoords = videoWidth / videoHeight * drawHeight;
    const videoHeightInDrawCoords = videoHeight / videoWidth * drawWidth;
    if (drawWidth > videoWidthInDrawCoords) {
        xOffset = Math.floor((drawWidth - videoWidthInDrawCoords) / 2);
        drawWidth = videoWidthInDrawCoords;
    } else if (drawHeight > videoHeightInDrawCoords) {
        yOffset = Math.floor((drawHeight - videoHeightInDrawCoords) / 2);
        drawHeight = videoHeightInDrawCoords;
    }
    // Convert a point in video coordinates to draw coordinates.
    function toDrawPoint(position) {
        return {
            x: xOffset + position.x * drawWidth / videoWidth,
            y: yOffset + position.y * drawHeight / videoHeight,
        };
    }
    // Convert a width in video coordinates to draw coordinates.
    function toDrawScale(width) {
        return width * drawWidth / videoWidth;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = `rgba(255,255,255,${backgroundOpacity})`;
    if (frame.dropped) {
        ctx.fillStyle = "gray";
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    frame.poses.forEach(pose => paintPose(ctx, pose, toDrawPoint, toDrawScale, debugView));

    if (frame.items) {
        frame.items.forEach(item => drawItem(ctx, item, canvasWidth, canvasHeight))
    }
}