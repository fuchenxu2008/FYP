const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const { port } = require('./config');
const algorithmController = require('./app');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());

io.on('connection', socket => {
    try {
        // Remove previous listeners to prevent duplicate
        socket.removeAllListeners();
        // Handle connection
        console.log('New connection');
        // Handle disconnect
        socket.on('disconnect', () => console.log('Disconnected'))
        // Handle shortest path command
        socketHandler(socket);
    } catch (err) {
        console.log('Socket error: ', err);
    }
});

const socketHandler = (socket) => {
    socket.on('runAStar', () => {
        console.log('Running A Star');
        const result = algorithmController.runAStar();
        socket.emit('AStarResult', result);
    })
    socket.on('runDijkstra', () => {
        console.log('Running Dijkstra');
        const result = algorithmController.runDijkstra();
        socket.emit('DijkstraResult', result);
    })
    socket.on('runBestFS', () => {
        console.log('Running Best First Search');
        const result = algorithmController.runBestFirstSearch()
        socket.emit('BestFSResult', result);
    })
}

server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
