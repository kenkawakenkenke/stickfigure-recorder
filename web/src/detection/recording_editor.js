


export function normalizeTime(recording) {
    const tFirst = recording.poses[0].t;
    recording.poses.forEach(pose => pose.t -= tFirst);
}
export function setFrameStartEnd(recording, first, last) {
    if (first > last) {
        return;
    }
    recording.firstFrame = first;
    recording.lastFrame = last;
    recording.poses.forEach((pose, i) => {
        pose.dropped = i < recording.firstFrame || recording.lastFrame < i;
    });
}