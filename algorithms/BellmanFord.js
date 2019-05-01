const ShortestPath = require('./ShortestPath');

class BellmanFord extends ShortestPath {
    constructor(graph) {
        super();
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

    run(source, dest) { // NODEID
        this.source = source;
        this.dest = dest;
        this.distMap.set(source, 0); // Initialize distance with 0
        this.activeNodes.set(source, 1); // Set as active

        for (let i = 0, nodeSize = this.graph.nodeMap.size; i < nodeSize - 1; i++) {
            Array.from(this.graph.roadMap.values()).forEach((road, j) => {
                const u = road.STARTID;
                const v = road.ENDID;
                const alt = this.getDist(u) + road.COST;
                if (this.getDist(u) !== Infinity && alt < this.getDist(v)) {
                    this.distMap.set(v, alt);
                    this.prevNodeMap.set(v, u);
                    // Used to render road
                    this.prevRoadMap.set(v.NODEID, neighborRoad);
                }
            })
        }

        Array.from(this.graph.roadMap.values()).forEach((road) => {
            const u = road.STARTID;
            const v = road.ENDID;
            const alt = this.getDist(u) + road.COST;
            if (this.getDist(u) !== Infinity && alt < this.getDist(v)) {
                return console.log('✘ Road network contains negative weight cycle!');
            }
        })

        // Detect destination
        if (this.prevNodeMap.get(dest)) {
            return console.log('√ Reached destination!');
        }

        return console.log('✘ Could not find path...');
    }
}

module.exports = BellmanFord;
