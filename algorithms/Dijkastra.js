class DijkstraShortestPath {
    constructor(graph) {
        this.graph = graph;
        this.activeRoads = new Map();
        this.walkedRoads = new Map();
        this.distMap = new Map();
        this.prevMap = new Map();
    }

    getDist(EDGEID) {
        const cost = this.distMap.get(EDGEID);
        return cost !== undefined ? cost : Number.POSITIVE_INFINITY;
    }

    run(source, dest) { // EDGEID
        this.distMap.set(source, 0);
        this.activeRoads.set(source, 1);
        // let n = 0;
        let lastRoad = null;
        // To use
        while (this.activeRoads.size) { // obj
            const u = this.graph.roadMap.get(
                Array.from(this.activeRoads.keys())
                    .reduce((a, b) => this.getDist(a) < this.getDist(b) ? a : b)
            ); // obj
            this.walkedRoads.set(u.EDGEID, 1);
            if (u.EDGEID === dest) {
                console.log('Reached dest');
                break;
            }
            // Remove u from Q
            this.activeRoads.delete(u.EDGEID);
            // console.log('n: ', ++n);
            const neighbors = this.graph.adjacencyList.get(u.EDGEID);
            // Updating distance
            neighbors.forEach(neighbor => { // EDGEID
                const v = this.graph.roadMap.get(neighbor); // obj
                const alt = this.getDist(u.EDGEID) + v.COST;
                if (alt < this.getDist(v.EDGEID)) {
                    this.distMap.set(v.EDGEID, alt);
                    this.prevMap.set(v.EDGEID, u.EDGEID);
                    lastRoad = v;
                }
                if (!this.walkedRoads.get(v.EDGEID))
                    this.activeRoads.set(v.EDGEID, 1);
            });
        };
        // console.log(lastRoad);
        // console.log(this.prevMap);
        
        // console.log(this.distMap);
        // console.log(this.prevMap);
    }
}

module.exports = DijkstraShortestPath;
