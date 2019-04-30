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
