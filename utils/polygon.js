exports.pointInPolygon = (node, { vertices = [] }) => {
    let crossingNum = 0;
    for (let i = 0, n = vertices.length; i < n; i++) {
        const vertexA = vertices[i % n];
        const vertexB = vertices[(i + 1) % n];
        if (this.rayWillIntersect(node, vertexA, vertexB)) {
            crossingNum += 1;
        }
    }
    return crossingNum % 2 !== 0;
}

/**
 * Ray down from (x, y) will cross the segment between (x1, y1) and (x2, y2) ?
 */
exports.rayWillIntersect = (node, [x1, y1], [x2, y2]) => {
    if (!((node.x > x1 && node.x < x2) || (node.x > x2 && node.x < x1)))
        return;
    const k = (y2 - y1) / (x2 - x1);
    const b = ((x2 - x1) * y2 - (y2 - y1) * x2) / (x2 - x1);
    return k * node.x + b < node.y;
}
