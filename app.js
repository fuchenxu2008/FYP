const { readJSON } = require('./utils/file');
const Road = require('./Road');
const Graph = require('./Graph');
const DijkastraShortestPath = require('./algorithms/Dijkastra');

const storeRoad = async () => {
    // Start to store road
    const graph = new Graph();
    const { features: roads } = await readJSON('./resources/sfo_roads.json');
    roads.forEach(({ properties = {}, geometry = {} }) => {
        const newRoad = new Road(properties, geometry);
        graph.addRoad(newRoad);
    });
    graph.linkRoads();
    return graph;
}

async function main() {
    const graph = await storeRoad();
    // const randomRoad1 = graph.getOneRoad();
    // const randomRoad2 = graph.getOneRoad();
    // console.log('source', randomRoad1);
    // console.log('dest: ', randomRoad2);
    // new DijkastraShortestPath(graph).run(randomRoad1.EDGEID, randomRoad2.EDGEID);
    // new DijkastraShortestPath(graph).run('-955330839', randomRoad2.EDGEID);
    // new DijkastraShortestPath(graph).run('958340131', '-955015939');
    new DijkastraShortestPath(graph).run('-960871510', '-957465325');
    const then = Date.now();
}

main();
