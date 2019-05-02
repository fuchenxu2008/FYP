class ShortestPath {
    traceRoute() {
        console.log(`Examined ${this.walkedNodes.size} nodes`);
        const lastRoad = this.prevRoadMap.get(this.dest);
        let tracert = [];

        if (lastRoad) {
            tracert.unshift(lastRoad.vertices);
            let current = this.dest;
            while (true) {
                current = this.prevNodeMap.get(current);
                const { vertices } = this.prevRoadMap.get(current) || {};
                if (!vertices) break;
                tracert.unshift(vertices);
            }
        }
        console.log('Route length: ', tracert.length);
        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [].concat.apply([], tracert),
            },
        }
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

    getEvaluation() {
        const lastRoad = this.prevRoadMap.get(this.dest)
        // If no path
        if (!lastRoad) return null;

        let tracertDist = lastRoad.LENGTH;
        let tracertCost = lastRoad.COST;
        let tracertLength = 1;

        let current = this.dest;
        while (true) {
            current = this.prevNodeMap.get(current);
            const prevRoad = this.prevRoadMap.get(current);
            if (!prevRoad) break;
            tracertDist += prevRoad.LENGTH;
            tracertCost += prevRoad.COST;
            tracertLength += 1;
        }
        return {
            distance: tracertDist,
            cost: tracertCost,
            traversed: this.walkedNodes.size,
            roadsNum: tracertLength,
        }
    }
}

module.exports = ShortestPath;
