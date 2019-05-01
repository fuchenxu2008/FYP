const { calDistance } = require('../utils/geometry');

class BestFirstSearchShortestPath {
    constructor(graph) {
        this.graph = graph;
        this.activeNodes = new Map(); // NODEID => 1
        this.walkedNodes = new Map(); // NODEID => 1
        this.hScoreMap = new Map(); // NODEID => fScore = gScore + heuristic
        this.prevNodeMap = new Map(); // NODEID => NODEID
        this.prevRoadMap = new Map(); // NODEID => EDGEID
    }

    hScore(NODEID) {
        const cost = this.hScoreMap.get(NODEID);
        return cost !== undefined ? cost : Number.POSITIVE_INFINITY;
    }

    heuristicCost(start, goal) {
        const startNode = this.graph.getNode(start);
        const goalNode = this.graph.getNode(goal);
        return calDistance(
            [startNode.vertex[0], startNode.vertex[1]],
            [goalNode.vertex[0], goalNode.vertex[1]]
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
                this.prevNodeMap.set(v.NODEID, u.NODEID);
                // Used to render road
                this.prevRoadMap.set(v.NODEID, neighborRoad);
            });
        };
        console.log('✘ Could not find path...');
        return [];
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
        return [].concat.apply([], tracert);
    }
}

module.exports = BestFirstSearchShortestPath;
