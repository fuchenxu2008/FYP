const ShortestPath = require('./ShortestPath');
const PriorityQueue = require('../dataStructure/PriorityQueue');

class Dijkstra extends ShortestPath {
    constructor(graph) {
        super();
        this.graph = graph;
        this.activeQueue = new PriorityQueue(); // activeNode ID with its dist as priority
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
        return neighborRoad.TIME || Number.POSITIVE_INFINITY;
    }

    run(source, dest, constraint = true) { // NODEID
        this.source = source;
        this.dest = dest;
        this.distMap.set(source, 0); // Initialize distance with 0
        this.activeQueue.enqueue(source, this.getDist(source));
        // To use
        while (this.activeQueue.length()) {
            const u = this.graph.getNode(this.activeQueue.dequeue().element);
            // Marked as walked
            this.walkedNodes.set(u.NODEID, 1);
            // Detect destination
            if (u.NODEID === dest) {
                return console.log('√ Reached destination!');
            }
            // Examine neighbors
            const neighborRoads = this.graph.getNeighborRoads(u.NODEID);
            neighborRoads.forEach(neighborRoad => { // Road obj
                const v = this.graph.getNode(neighborRoad.ENDID); // Node obj
                 // Prevent duplicate set active
                if (this.walkedNodes.get(v.NODEID)) return;
                // Detect obstacles
                if (constraint && this.graph.isBlocked(v.NODEID)) return;
                // Calculate new distance
                const alt = this.getDist(u.NODEID) + this.getLength(u.NODEID, v.NODEID);  
                // If this node hasn't been evaluated before => update distance  
                // else only update if has a smaller distance   
                if (!this.activeQueue.contains(v.NODEID)) {
                    this.activeQueue.enqueue(v.NODEID, this.getDist(v.NODEID));
                } else if (alt >= this.getDist(v.NODEID)) {
                    return;
                }
                this.distMap.set(v.NODEID, alt); // Update distance
                this.prevNodeMap.set(v.NODEID, u.NODEID);
                // Used to render road
                this.prevRoadMap.set(v.NODEID, neighborRoad);
            });
        };
        return console.log('✘ Could not find path...');
    }
}

module.exports = Dijkstra;
