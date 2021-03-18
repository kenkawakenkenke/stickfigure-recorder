
export function avgPosition(position1, position2, mix2 = 0.5) {
    return {
        x: (position1.x * (1 - mix2) + position2.x * mix2),
        y: (position1.y * (1 - mix2) + position2.y * mix2),
    };
}
export function distBetween(position1, position2) {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
}
export function extendPosition(penultimate, last, extension) {
    return {
        x: penultimate.x + (last.x - penultimate.x) * (1 + extension),
        y: penultimate.y + (last.y - penultimate.y) * (1 + extension),
    };
}
