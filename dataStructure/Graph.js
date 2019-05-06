const { pointInPolygon } = require('../utils/polygon');

class Graph {
    constructor() {
        this.roadMap = new Map(); // EDGEID => Road
        this.nodeMap = new Map(); // NODEID => Node
        this.obstacleMap = new Map(); // POLYID => Polygon
        this.neighborMap = new Map(); // NODEID => [EDGEID]
        // Calculating a weighted averge speed for heuristic function
        this.allRoadLength = 0;
        this.speedWeight = 0;
        this.avergeSpeed = 1;
    }

    addObstacle(newPolygon) {
        this.obstacleMap.set(newPolygon.POLYID, newPolygon);
    }

    addNode(newNode) {
        this.nodeMap.set(newNode.NODEID, newNode);
    }

    addRoad(newRoad) {
        this.roadMap.set(newRoad.EDGEID, newRoad);
        this.linkRoads(newRoad);
        this.allRoadLength += newRoad.LENGTH;
        this.speedWeight += newRoad.LENGTH * newRoad.SPD;
        this.avergeSpeed = this.speedWeight / this.allRoadLength;
    }

    linkRoads(road) {
        this.neighborMap.set(road.STARTID, (this.neighborMap.get(road.STARTID) || [])
            .map(id => Math.abs(id)).includes(Math.abs(road.EDGEID)) // prevent self link
            ? this.neighborMap.get(road.STARTID)
            : (this.neighborMap.get(road.STARTID) || []).concat(road.EDGEID)
        );
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

    isBlocked(NODEID) {
        return Array.from(this.obstacleMap.values()).some(obstacle => pointInPolygon(this.getNode(NODEID), obstacle));
    }
}

module.exports = Graph;
