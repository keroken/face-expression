const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
  console.log('a user connected');

  console.log(socket.id);
  io.to(socket.id).emit('token', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (smileData) => {
    io.emit('chat message', smileData);
  });
});

server.listen(3000,() => {
  console.log('listening on *:3000');
});