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
        this.distMap.set(source, 0); // Initialize distance with 0
        this.activeRoads.set(source, 1); // Set as active
        // To use
        while (this.activeRoads.size) {
            const u = this.graph.getRoad(
                Array.from(this.activeRoads.keys())
                    .reduce((a, b) => this.getDist(a) < this.getDist(b) ? a : b)
            );
            // Remove u from Q
            this.walkedRoads.set(u.EDGEID, 1);
            this.activeRoads.delete(u.EDGEID);
            // Detect destination
            if (u.EDGEID === dest) {
                console.log('Reached destination!');
                return this.traceRoute(source, dest);
            }
            // Examine neighbors
            const neighbors = this.graph.adjacencyList.get(u.EDGEID);
            neighbors.forEach(neighbor => { // EDGEID
                const v = this.graph.getRoad(neighbor); // obj
                const alt = this.getDist(u.EDGEID) + v.COST;
                if (alt < this.getDist(v.EDGEID)) {
                    this.distMap.set(v.EDGEID, alt); // Update distance
                    this.prevMap.set(v.EDGEID, u.EDGEID);
                }
                if (!this.walkedRoads.get(v.EDGEID)) { // Preveent duplicate set active
                    this.activeRoads.set(v.EDGEID, 1);
                }
            });
        };
    }

    traceRoute(source, dest) {
        console.log(`Examined ${this.walkedRoads.size} roads`);
        const tracert = [dest];
        let current = dest;
        while (current !== source) {
            current = this.prevMap.get(current)
            tracert.unshift(current)
        }
        console.log('tracert: ', tracert.join(' -> '));
    }
}

module.exports = DijkstraShortestPath;
