const { readJSON } = require('./utils/file');
const Road = require('./Road');
const Graph = require('./Graph');

const storeRoad = async () => {
    const now = Date.now();
    const graph = new Graph();
    const { features: roads } = await readJSON('./resources/sfo_roads.json');
    roads.forEach(({ properties = {} }) => {
        const newRoad = new Road(properties);
        graph.addRoad(newRoad);
    });
    graph.linkRoads();
    const then = Date.now()
    console.log(`Time used: ${(then - now) / 1000}s`);
    return graph;
}

storeRoad().then((graph) => {
    const randomRoad = graph.getOneRoad();
    console.log('randomRoad: ', randomRoad);
    graph.getAdjacentRoads(randomRoad)
})