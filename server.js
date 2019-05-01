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
    // socket.emit('roadLoad', await readJSON('./resources/sfo_roads.json'));
    // socket.emit('obstacleLoad', await readJSON('./resources/sfo_poly.json'));
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
    let sent = false;
    const suite = new Benchmark.Suite();
    suite
      .add('AStar', () => {
        const result = algorithmController.runAStar(source, dest);
        if (!sent) {
          socket.emit('AStarResult', result);
          sent = true;
        }
      })
      .on('cycle', event => {
        console.log(String(event.target));
        socket.emit('AStar_benchmark', 1 / event.target.hz);
      })
      .run({ async: true });
  });

  socket.on('runDijkstra', ({ source, dest }) => {
    console.log('Running Dijkstra');
    let sent = false;
    const suite = new Benchmark.Suite();
    suite
      .add('Dijkstra', () => {
        const result = algorithmController.runDijkstra(source, dest);
        if (!sent) {
          socket.emit('DijkstraResult', result);
          sent = true;
        }
      })
      .on('cycle', event => {
        console.log(String(event.target));
        socket.emit('Dijkstra_benchmark', 1 / event.target.hz);
      })
      .run({ async: true });
  });

  socket.on('runBestFS', ({ source, dest }) => {
    console.log('Running Best First Search');
    let sent = false;
    const suite = new Benchmark.Suite();
    suite
      .add('BestFS', () => {
        const result = algorithmController.runBestFirstSearch(source, dest);
        if (!sent) {
          socket.emit('BestFSResult', result);
          sent = true;
        }
      })
      .on('cycle', event => {
        console.log(String(event.target));
        socket.emit('BestFS_benchmark', 1 / event.target.hz);
      })
      .run({ async: true });
  });
};

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
