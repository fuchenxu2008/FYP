class DijkstraShortestPath {
    constructor(graph) {
        this.graph = graph;
        this.activeNodes = new Map(); // NODEID => 1
        this.walkedNodes = new Map(); // NODEID => 1
        this.distMap = new Map(); // NODEID => distance
        this.prevMap = new Map(); // NODEID => NODEID
    }

    getDist(NODEID) {
        const cost = this.distMap.get(NODEID);
        return cost !== undefined ? cost : Number.POSITIVE_INFINITY;
    }

    getLength(startID, endID) {
        const neighborRoad = this.graph.getNeighborRoads(startID).find(nr => nr.ENDID === endID) || {};
        return neighborRoad.COST || Number.POSITIVE_INFINITY;
    }

    run(source, dest) { // NODEID
        this.distMap.set(source, 0); // Initialize distance with 0
        this.activeNodes.set(source, 1); // Set as active
        // To use
        while (this.activeNodes.size) {
            const u = this.graph.getNode(
                Array.from(this.activeNodes.keys())
                    .reduce((a, b) => this.getDist(a) < this.getDist(b) ? a : b)
            );
            // Remove u from Q
            this.walkedNodes.set(u.NODEID, 1);
            this.activeNodes.delete(u.NODEID);
            // Detect destination
            if (u.NODEID === dest) {
                console.log('√ Reached destination!');
                return this.traceRoute(source, dest);
            }
            // Examine neighbors
            const neighborRoads = this.graph.getNeighborRoads(u.NODEID);
            neighborRoads.forEach(neighborRoad => { // Road obj
                const v = this.graph.getNode(neighborRoad.ENDID); // Node obj
                const alt = this.getDist(u.NODEID) + this.getLength(u.NODEID, v.NODEID);
                if (alt < this.getDist(v.NODEID)) {
                    this.distMap.set(v.NODEID, alt); // Update distance
                    this.prevMap.set(v.NODEID, u.NODEID);
                }
                if (!this.walkedNodes.get(v.NODEID)) { // Prevent duplicate set active
                    this.activeNodes.set(v.NODEID, 1);
                }
            });
        };
        console.log('✘ Could not find path...');
    }

    traceRoute(source, dest) {
        console.log(`Examined ${this.walkedNodes.size} nodes`);
        const tracert = [dest];
        let current = dest;
        while (current !== source) {
            current = this.prevMap.get(current)
            tracert.unshift(current)
        }
        console.log('Tracert: ', tracert.join(' -> '));
    }
}

module.exports = DijkstraShortestPath;
