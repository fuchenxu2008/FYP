class Graph {
    constructor() {
        this.adjacencyList = new Map(); // EDGEID => [EDGEID] next roads
        this.roadMap = new Map(); // EDGEID => Road
        this.nodeMap = new Map(); // STARTID => EDGEID
    }

    addRoad(newRoad) {
        // const roads = this.adjacencyList.keys();
        this.roadMap.set(newRoad.EDGEID, newRoad);
        this.nodeMap.set(newRoad.STARTID, [
            ...(this.nodeMap.get(newRoad.STARTID) || []),
            newRoad.EDGEID
        ]);
    }

    linkRoads() {
        const roads = Array.from(this.roadMap.keys());
        roads.forEach((road) => {
            const thisRoad = this.roadMap.get(road);
            const jointRoads = this.nodeMap.get(thisRoad.ENDID) || [];
            this.adjacencyList.set(road, jointRoads);
        });
    }

    getOneRoad() {
        const roads = Array.from(this.roadMap.keys());
        const randomId = roads[Math.floor(Math.random() * 1000)];
        return this.roadMap.get(randomId);
    }

    getAdjacentRoads(road) {
        return this.adjacencyList.get(road.EDGEID);
    }

    printGraph() {
        const roads = Array.from(this.roadMap.keys());
        const printed = roads.map((EDGEID) => {
            const road = this.roadMap.get(EDGEID);
            const jointRoads = this.adjacencyList.get(EDGEID).map(roadId => this.roadMap.get(roadId))
            return {
                road,
                jointRoads,
            }
        })
    }
}

module.exports = Graph;
