
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
    }
    smoothed() {
        const head = this.points.length < this.window ? 0 : this.tail;
        const numPoints = Math.min(this.points.length, this.window);

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
export default FeatureSmoother;
