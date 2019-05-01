const convertCoordinate = ([lon, lat]) => {
    let b = 20037508.34;
    return [
      (lon * 180) / b,
      (Math.atan(Math.exp((lat * Math.PI) / b)) * 360) / Math.PI - 90,
    ];
}

exports.convertNode = (geojson) => ({
    ...geojson,
    features: geojson.features.map(feature => ({
        ...feature,
        geometry: {
            ...feature.geometry,
            coordinates: convertCoordinate(feature.geometry.coordinates),
        },
    }))
})

exports.convertRoad = (geojson) => ({
    ...geojson,
    features: geojson.features.map(feature => ({
        ...feature,
        geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates.map(coordinate =>
                convertCoordinate(coordinate),                
            )
        },
    }))
})

exports.convertPolygon = (geojson) => ({
    ...geojson,
    features: geojson.features.map(feature => ({
        ...feature,
        geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates.map(coordinates => (
                coordinates.map(coordinate => 
                    convertCoordinate(coordinate)
                )
            )),
        },
    }))
})

exports.calDistance = ([x1, y1], [x2, y2]) => {
    return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
}

exports.getNearestNode = (point, nodeMap) => {
    if (!point || !nodeMap) return null;
    const nearest = { NODEID: null, distance: Number.POSITIVE_INFINITY };
    const allNodes = Array.from(nodeMap.values());
    let i = 0;
    const iMax = allNodes.length;
    for (; i < iMax; i++) {
        const node = allNodes[i];
        const newDist = this.calDistance([point[0], point[1]], [node.x, node.y]);
        if (newDist < nearest.distance) {
            nearest.NODEID = node.NODEID;
            nearest.distance = newDist;
        }
    }
    return nearest.NODEID;
}
