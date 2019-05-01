class ShortestPath {
    traceRoute() {
        console.log(`Examined ${this.walkedNodes.size} nodes`);
        if (!this.prevRoadMap.get(this.dest)) return [];

        const tracert = [this.prevRoadMap.get(this.dest).vertices];
        let current = this.dest;
        while (true) {
            current = this.prevNodeMap.get(current);
            const { vertices } = this.prevRoadMap.get(current) || {};
            if (!vertices) break;
            tracert.unshift(vertices);
        }
        console.log('Route length: ', tracert.length);
        return [].concat.apply([], tracert);
    }

    getTraversed() {
        // Return GeoJSON
        const getPointJSON = (point) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: point
            },
        })

        const features = [];
        for (let [NODEID,] of this.walkedNodes) {
            features.push(
                getPointJSON(this.graph.getNode(NODEID).vertex)
            );
        }

        return {
            type: 'FeatureCollection',
            name: 'traversed_points',
            features,
        }
    }
}

module.exports = ShortestPath;
