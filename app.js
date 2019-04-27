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
    const road = graph.getRoad('-958340131');
    // console.log('road: ', road);
    // const next1 = graph.nodeMap.get(road.ENDID);
    // const next2 = graph.adjacencyList.get(road.EDGEID)
    // console.log('next1: ', next1);
    // console.log('next2: ', next2);
    // const r2 = graph.getRoad('958340131');
    // console.log('r2: ', r2);
    // const randomRoad1 = graph.getOneRoad();
    const randomRoad2 = graph.getOneRoad();
    console.log('source', graph.getRoad('958340131'));
    console.log('dest: ', randomRoad2);
    // console.log(randomRoad1.EDGEID);
    // console.log(randomRoad2.EDGEID);
    // new DijkastraShortestPath(graph).run(randomRoad1.EDGEID, randomRoad2.EDGEID);
    // new DijkastraShortestPath(graph).run('-955330839', randomRoad2.EDGEID);
    new DijkastraShortestPath(graph).run('958340131', randomRoad2.EDGEID);
    const then = Date.now();
}

main();
