const { readJSON } = require('./utils/file');
const Road = require('./dataStructure/Road');
const Node = require('./dataStructure/Node');
const Graph = require('./dataStructure/Graph');
const DijkastraShortestPath = require('./algorithms/Dijkastra');
const AStarShortestPath = require('./algorithms/AStar');

const storeRoad = async (graph) => {
    const { features: roads } = await readJSON('./resources/sfo_roads.json');
    roads.forEach(({ properties = {}, geometry = {} }) => {
        const newRoad = new Road(properties);
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

async function main() {
    const graph = new Graph();
    await storeNode(graph);
    await storeRoad(graph);
    // const randomNode1 = graph.getOneNode();
    // console.log('randomNode1: ', randomNode1);
    // const randomNode2 = graph.getOneNode();
    // console.log('randomNode2: ', randomNode2);
    // new DijkastraShortestPath(graph).run(randomNode1.NODEID, randomNode2.NODEID);
    // new DijkastraShortestPath(graph).run('48438271', '48432890');
    new AStarShortestPath(graph).run('48438271', '48432890');
}

main();
