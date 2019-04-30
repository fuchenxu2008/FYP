class BestFirstSearchShortestPath {
    constructor(graph) {
        this.graph = graph;
        this.activeNodes = new Map(); // NODEID => 1
        this.walkedNodes = new Map(); // NODEID => 1
        this.hScoreMap = new Map(); // NODEID => fScore = gScore + heuristic
        this.prevMap = new Map(); // NODEID => NODEID
    }

    hScore(NODEID) {
        const cost = this.hScoreMap.get(NODEID);
        return cost !== undefined ? cost : Number.POSITIVE_INFINITY;
    }

    calDistance([x1, y1], [x2, y2]) {
        return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    }

    heuristicCost(start, goal) {
        const startNode = this.graph.getNode(start);
        const goalNode = this.graph.getNode(goal);
        return this.calDistance(
            [startNode.x, startNode.y],
            [goalNode.x, goalNode.y]
        );
    }

    run(source, dest) { // NODEID
        this.hScoreMap.set(source, this.heuristicCost(source, dest)); // Initialize hScore with heuristic cost
        this.activeNodes.set(source, 1); // Set as active
        // To use
        while (this.activeNodes.size) {
            const u = this.graph.getNode(
                Array.from(this.activeNodes.keys())
                    .reduce((a, b) => this.hScoreMap.get(a) < this.hScoreMap.get(b) ? a : b)
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
                const alt = this.heuristicCost(v.NODEID, dest);
                // If this node hasn't been evaluated before => update distance  
                // else only update if has a smaller distance
                if (!this.activeNodes.get(v.NODEID)) {
                    this.activeNodes.set(v.NODEID, 1);
                } else if (alt >= this.hScore(u.NODEID)) {
                    return;
                }
                this.hScoreMap.set(v.NODEID, alt); // Update distance
                this.prevMap.set(v.NODEID, u.NODEID);
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
        // console.log('Tracert: ', tracert.join(' -> '));
        console.log('Route length: ', tracert.length);
        return tracert.length;
    }
}

module.exports = BestFirstSearchShortestPath;
