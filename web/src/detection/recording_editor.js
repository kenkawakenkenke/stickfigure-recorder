


export function normalizeTime(recording) {
    const tFirst = recording[0].t;
    recording.forEach(pose => pose.t -= tFirst);
}