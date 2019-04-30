class DijkstraShortestPath {
    constructor(graph) {
        this.graph = graph;
        this.activeNodes = new Map(); // NODEID => 1
        this.walkedNodes = new Map(); // NODEID => 1
        this.distMap = new Map(); // NODEID => distance
        this.prevNodeMap = new Map(); // NODEID => NODEID
        this.prevRoadMap = new Map(); // NODEID => EDGEID
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
            // Detect destination
            if (u.NODEID === dest) {
                console.log('√ Reached destination!');
                return this.traceRoute(source, dest);
            }
            // Marked as walked
            this.walkedNodes.set(u.NODEID, 1);
            this.activeNodes.delete(u.NODEID);
            // Examine neighbors
            const neighborRoads = this.graph.getNeighborRoads(u.NODEID);
            neighborRoads.forEach(neighborRoad => { // Road obj
                const v = this.graph.getNode(neighborRoad.ENDID); // Node obj
                 // Prevent duplicate set active
                if (this.walkedNodes.get(v.NODEID) || this.graph.isBlocked(v.NODEID)) {
                    return;
                }
                // Calculate new distance
                const alt = this.getDist(u.NODEID) + this.getLength(u.NODEID, v.NODEID);  
                // If this node hasn't been evaluated before => update distance  
                // else only update if has a smaller distance   
                if (!this.activeNodes.get(v.NODEID)) {
                    this.activeNodes.set(v.NODEID, 1);
                } else if (alt >= this.getDist(v.NODEID)) {
                    return;
                }
                this.distMap.set(v.NODEID, alt); // Update distance
                this.prevNodeMap.set(v.NODEID, u.NODEID);
                // Used to render road
                this.prevRoadMap.set(v.NODEID, neighborRoad);
            });
        };
        console.log('✘ Could not find path...');
    }

    traceRoute(source, dest) {
        console.log(`Examined ${this.walkedNodes.size} nodes`);
        const tracert = [this.prevRoadMap.get(dest).vertices];
        let current = dest;
        while (true) {
            current = this.prevNodeMap.get(current)
            const { vertices } = this.prevRoadMap.get(current) || {};
            if (!vertices) break;
            tracert.unshift(vertices);
        }
        console.log('Route length: ', tracert.length);
        return [].concat.apply([], tracert);
    }
}

module.exports = DijkstraShortestPath;
