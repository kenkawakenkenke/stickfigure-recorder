
class FeatureSmoother {
    constructor(window) {
        this.window = window;
        this.points = [];
        this.tail = 0;
    }
    add(position) {
        if (this.points.length < this.window) {
            this.points.push(position);
            this.tail = (this.tail + 1) % this.window;
            return;
        }
        this.points[this.tail] = position;

        this.tail = (this.tail + 1) % this.window;
        return this.smoothed();
    }
    num() {
        return this.points.length;
    }
    smoothed() {
        const head = this.points.length < this.window ? 0 : this.tail;
        const numPoints = Math.min(this.points.length, this.window);

        // TODO: make this incremental.
        let sumX = 0;
        let sumY = 0;
        for (let i = 0; i < numPoints; i++) {
            const idx = (i + head) % this.points.length;
            const point = this.points[idx];
            sumX += point.x;
            sumY += point.y;
        }
        return {
            x: (sumX / numPoints),
            y: (sumY / numPoints),
        };
    }
}

class PoseSmoother {
    constructor(smoothingWindow) {
        this.smoothingWindow = smoothingWindow;
        this.smootherForFeature = {};
    }
    smoother(feature) {
        let smoother = this.smootherForFeature[feature.part];
        if (!smoother) {
            this.smootherForFeature[feature.part] = smoother = new FeatureSmoother(this.smoothingWindow);
        }
        return smoother;
    }
    add(feature) {
        const smoother = this.smoother(feature);
        return smoother.add(feature.position);
    }
    smooth(pose) {
        pose.keypoints.forEach(feature => {
            const smoothed = this.add(feature);
            if (smoothed) {
                feature.position = smoothed;
            }
        });
    }
}
export default PoseSmoother;
