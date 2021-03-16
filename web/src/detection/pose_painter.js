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

function addSyntheticFeatures(features) {
    const syntheticFeatures = [
        {
            part: "neck",
            position:
                avgPosition(
                    avgPosition(features["leftShoulder"].position, features["rightShoulder"].position),
                    features["nose"].position,
                    1 / 3),
        },
        {
            part: "hip",
            position:
                avgPosition(features["leftHip"].position, features["rightHip"].position)
        },
        {
            part: "leftHand",
            position:
                extendPosition(features["leftElbow"].position, features["leftWrist"].position, 0.25),
        },
        {
            part: "rightHand",
            position:
                extendPosition(features["rightElbow"].position, features["rightWrist"].position, 0.25),
        },
        {
            part: "leftFoot",
            position:
                extendPosition(features["leftKnee"].position, features["leftAnkle"].position, 0.25),
        },
        {
            part: "rightFoot",
            position:
                extendPosition(features["rightKnee"].position, features["rightAnkle"].position, 0.25),
        }
    ];
    syntheticFeatures.forEach(feature => features[feature.part] = feature);
}

export function drawCircle(ctx, point, radius, fillColor = "black") {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    // ctx.strokeText(text, wrist.position.x, wrist.position.y);
    ctx.fillStyle = fillColor;
    ctx.fill();
}
function avgPosition(position1, position2, mix2 = 0.5) {
    return {
        x: (position1.x * (1 - mix2) + position2.x * mix2),
        y: (position1.y * (1 - mix2) + position2.y * mix2),
    };
}
function distBetween(position1, position2) {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
}
function extendPosition(penultimate, last, extension) {
    return {
        x: penultimate.x + (last.x - penultimate.x) * (1 + extension),
        y: penultimate.y + (last.y - penultimate.y) * (1 + extension),
    };
}

export function drawLines(ctx, points, width, style = "black") {
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
export function drawLine(ctx, fromPoint, toPoint, width) {
    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = width;
    ctx.stroke();
}

export default function paintPose(ctx, pose, backgroundOpacity = 1, debugView = false) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const features =
        pose.keypoints.reduce((accum, c) => { accum[c.part] = c; return accum; }, {});
    addSyntheticFeatures(features);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(255,255,255,${backgroundOpacity})`;
    if (pose.dropped) {
        ctx.fillStyle = "gray";
    }
    ctx.fillRect(0, 0, width, height);

    if (debugView) {
        Object.values(features).forEach(feature => {
            drawCircle(ctx, feature.position, 5, "red");
        });
        debugSegments.forEach(segment => {
            const points = segment.features.map(feature => features[feature].position);
            drawLines(ctx, points, 5, "#00ff00");
        });

        return;
    }

    segments.forEach(segment => {
        const points = segment.features.map(feature => features[feature].position);
        drawLines(ctx, points, 20);
    });
    // Draw face
    drawCircle(ctx, features["nose"].position,
        Math.ceil(distBetween(features["nose"].position, features["neck"].position)));

    const usedFeaturesSet = {};
    segments.forEach(segment => {
        segment.features.forEach(feature => usedFeaturesSet[feature] = true);
    });
}