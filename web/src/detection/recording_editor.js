


export function normalizeTime(recording) {
    const tFirst = recording.poses[0].t;
    recording.poses.forEach(pose => pose.t -= tFirst);
}