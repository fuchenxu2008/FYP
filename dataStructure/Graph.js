class Graph {
    constructor() {
        this.roadMap = new Map(); // EDGEID => Road
        this.nodeMap = new Map(); // NODEID => Node
        this.neighborMap = new Map(); // NODEID => [EDGEID]
    }

    calDistance([x1, y1], [x2, y2]) {
        return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    }

    addNode(newNode) {
        this.nodeMap.set(newNode.NODEID, newNode);
    }

    addRoad(newRoad) {
        this.roadMap.set(newRoad.EDGEID, newRoad);
        this.linkRoads(newRoad);
    }

    linkRoads(road) {
        this.neighborMap.set(road.STARTID, (this.neighborMap.get(road.STARTID) || [])
            .map(id => Math.abs(id)).includes(Math.abs(road.EDGEID)) // prevent self link
            ? this.neighborMap.get(road.STARTID)
            : (this.neighborMap.get(road.STARTID) || []).concat(road.EDGEID)
        );
    }

    getOneRoad() {
        const roads = Array.from(this.roadMap.keys());
        const randomId = roads[Math.floor(Math.random() * 1000)];
        return this.roadMap.get(randomId);
    }

    getOneNode() {
        const nodes = Array.from(this.nodeMap.keys());
        const randomId = nodes[Math.floor(Math.random() * 1000)];
        return this.nodeMap.get(randomId);
    }

    getRoad(EDGEID) {
        return this.roadMap.get(EDGEID);
    }

    getNode(NODEID) {
        return this.nodeMap.get(NODEID);
    }

    getNeighborRoads(NODEID) {
        return (this.neighborMap.get(NODEID) || []).map(EDGEID => this.getRoad(EDGEID));
    }
}

module.exports = Graph;
