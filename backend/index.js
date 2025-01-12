const express = require('express');

const http = require('http');

const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = 3000;

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('message', ({ message, nick, type }) => {
    console.log(`${nick}: ${message} | ${socket.id}`);

    io.emit('chat-message', { message, nick, userId: socket.id, type });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
