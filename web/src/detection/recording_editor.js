


export function normalizeTime(recording) {
    const tFirst = recording.frames[0].t;
    recording.frames.forEach(frame => frame.t -= tFirst);
}
export function setFrameStartEnd(recording, first, last) {
    if (first > last) {
        return;
    }
    recording.firstFrame = first;
    recording.lastFrame = last;
    recording.frames.forEach((frame, i) => {
        frame.dropped = i < recording.firstFrame || recording.lastFrame < i;
    });
}