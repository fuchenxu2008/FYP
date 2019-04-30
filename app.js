const { readJSON } = require('./utils/file');
const Road = require('./dataStructure/Road');
const Node = require('./dataStructure/Node');
const Polygon = require('./dataStructure/Polygon');
const Graph = require('./dataStructure/Graph');
const Dijkstra = require('./algorithms/Dijkstra');
const AStar = require('./algorithms/AStar');
const BestFirstSearch = require('./algorithms/BestFirstSearch');
const BellmanFord = require('./algorithms/BellmanFord');

let graph;

const storeRoad = async (graph) => {
    const { features: roads } = await readJSON('./resources/sfo_roads.json');
    roads.forEach(({ properties = {}, geometry = {} }) => {
        const newRoad = new Road(properties, geometry);
        graph.addRoad(newRoad);
    });
}

const storeNode = async (graph) => {
    const { features: nodes } = await readJSON('./resources/sfo_nodes.json');
    nodes.forEach(({ properties = {}, geometry = {} }) => {
        const newNode = new Node(properties, geometry);
        graph.addNode(newNode);
    });
}

const storePolygon = async (graph) => {
    const { features: polygons } = await readJSON('./resources/sfo_poly.json');
    polygons.forEach(({ properties = {}, geometry = {} }) => {
        const newPolygon = new Polygon(properties, geometry);
        graph.addObstacle(newPolygon);
    });
}

(async function main() {
    graph = new Graph();
    await Promise.all([
        storeNode(graph),
        storeRoad(graph),
        storePolygon(graph),
    ]);
    console.log('√ Data structure established');
})();

exports.runDijkstra = () => {
    return new Dijkstra(graph).run('48438271', '48432890');
}

exports.runAStar = () => {
    return new AStar(graph).run('48438271', '48432890');
}

exports.runBestFirstSearch = () => {
    return new BestFirstSearch(graph).run('48438271', '48432890');
}
