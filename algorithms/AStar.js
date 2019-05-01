const ShortestPath = require('./ShortestPath');
const { calDistance } = require('../utils/geometry');

class AStar extends ShortestPath {
    constructor(graph) {
        super();        
        this.graph = graph;
        this.activeNodes = new Map(); // NODEID => 1
        this.walkedNodes = new Map(); // NODEID => 1
        this.gScoreMap = new Map(); // NODEID => gScore
        this.fScoreMap = new Map(); // NODEID => fScore = gScore + heuristic
        this.prevNodeMap = new Map(); // NODEID => NODEID
        this.prevRoadMap = new Map(); // NODEID => EDGEID
    }

    gScore(NODEID) {
        const cost = this.gScoreMap.get(NODEID);
        return cost !== undefined ? cost : Number.POSITIVE_INFINITY;
    }

    fScore(NODEID) {
        const cost = this.fScoreMap.get(NODEID);
        return cost !== undefined ? cost : Number.POSITIVE_INFINITY;
    }

    getLength(startID, endID) {
        const neighborRoad = this.graph.getNeighborRoads(startID).find(nr => nr.ENDID === endID) || {};
        return neighborRoad.COST || Number.POSITIVE_INFINITY;
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
        this.source = source;
        this.dest = dest;
        this.gScoreMap.set(source, 0); // Initialize gScore with 0
        this.fScoreMap.set(source, 0 + this.heuristicCost(source, dest)); // Initialize fScore with 0 + heuristic cost
        this.activeNodes.set(source, 1); // Set as active
        // To use
        while (this.activeNodes.size) {
            const u = this.graph.getNode(
                Array.from(this.activeNodes.keys())
                    .reduce((a, b) => this.fScoreMap.get(a) < this.fScoreMap.get(b) ? a : b)
            );
            // Detect destination
            if (u.NODEID === dest) {
                return console.log('√ Reached destination!');
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
                const alt = this.gScore(u.NODEID) + this.getLength(u.NODEID, v.NODEID);
                // If this node hasn't been evaluated before => update distance  
                // else only update if has a smaller distance
                if (!this.activeNodes.get(v.NODEID)) {
                    this.activeNodes.set(v.NODEID, 1);
                } else if (alt >= this.gScore(v.NODEID)) {
                    return;
                }
                this.gScoreMap.set(v.NODEID, alt); // Update distance
                this.fScoreMap.set(v.NODEID, alt + this.heuristicCost(v.NODEID, dest)); // Update distance
                this.prevNodeMap.set(v.NODEID, u.NODEID);
                // Used to render road
                this.prevRoadMap.set(v.NODEID, neighborRoad);
            });
        };
        return console.log('✘ Could not find path...');
    }
}

module.exports = AStar;
