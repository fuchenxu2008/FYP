class ShortestPath {
    traceRoute() {
        console.log(`Examined ${this.walkedNodes.size} nodes`);
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
        const getPoint = (point) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: point
            },
        })
        return {
            type: 'FeatureCollection',
            name: 'traversed_points',
            features: Array.from(this.walkedNodes.keys()).map(NODEID => (
                getPoint(this.graph.getNode(NODEID).vertex))
            )
        }
    }
}

module.exports = ShortestPath;
