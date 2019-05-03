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

exports.calDistance = ([lon1, lat1], [lon2, lat2]) => {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1); 
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c * 1000; // Distance in m
}

exports.getNearestNode = (point, nodeMap) => {
    if (!point || !nodeMap) return null;
    const nearest = { NODEID: null, distance: Number.POSITIVE_INFINITY };
    const allNodes = Array.from(nodeMap.values());
    let i = 0;
    const iMax = allNodes.length;
    for (; i < iMax; i++) {
        const node = allNodes[i];
        const newDist = this.calDistance([point[0], point[1]], [node.vertex[0], node.vertex[1]]);
        if (newDist < nearest.distance) {
            nearest.NODEID = node.NODEID;
            nearest.distance = newDist;
        }
    }
    return nearest.NODEID;
}
