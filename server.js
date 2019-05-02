const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const Benchmark = require('benchmark');
const { port } = require('./config');
const algorithmController = require('./app');
const { readJSON } = require('./utils/file');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());

io.on('connection', async (socket) => {
  try {
    // Remove previous listeners to prevent duplicate
    socket.removeAllListeners();
    // Handle connection
    console.log('New connection');
    // Send obstacle geojson
    socket.emit('obstacles', await readJSON('./resources/sfo_poly.json'));
    // Handle disconnect
    socket.on('disconnect', () => console.log('Disconnected'));
    // Handle shortest path command
    socketHandler(socket);
  } catch (err) {
    console.log('Socket error: ', err);
  }
});

const socketHandler = socket => {
  socket.on('runAStar', ({ source, dest }) => {
    console.log('Running A Star');
    const sp = algorithmController.runAStar(source, dest);
    socket.emit('AStarRoute', sp.traceRoute());
    socket.emit('AStarTraversed', sp.getTraversed());
  });

  socket.on('runDijkstra', ({ source, dest }) => {
    console.log('Running Dijkstra');
    const sp = algorithmController.runDijkstra(source, dest);
    socket.emit('DijkstraRoute', sp.traceRoute());
    socket.emit('DijkstraTraversed', sp.getTraversed());
  });

  socket.on('runBestFS', ({ source, dest }) => {
    console.log('Running Best First Search');
    const sp = algorithmController.runBestFirstSearch(source, dest);
    socket.emit('BestFSRoute', sp.traceRoute());
    socket.emit('BestFSTraversed', sp.getTraversed());
  });

  socket.on('runBenchmark', ({ source, dest }) => {
    // Benchmark
    const suite = new Benchmark.Suite();
    suite
      .add('AStar', function() {
        const sp = algorithmController.runAStar(source, dest);
        this.evaluation = sp.getEvaluation();
      })
      .add('Dijkstra', function() {
        const sp = algorithmController.runDijkstra(source, dest);
        this.evaluation = sp.getEvaluation();
      })
      .add('BestFirstSearch', function() {
        const sp = algorithmController.runBestFirstSearch(source, dest);
        this.evaluation = sp.getEvaluation();
      })
      .on('cycle', function({ target }) {
        console.log(String(target));
        socket.emit('benchmark', {
          name: target.name,
          runTime: 1 / Number(target.hz),
          ...target.evaluation,
        });
      })
      .on('complete', function(event) {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
      })
      .run({ async: true });
  });
};

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
