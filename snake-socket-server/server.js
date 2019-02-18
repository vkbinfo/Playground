const express = require('express');

const app = express();
const socket = require('socket.io');

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('server running on port 3000');
});

function makeFood() {
  const x = Math.floor(Math.random() * 40);
  const y = Math.floor(Math.random() * 40);
  return {
    x,
    y
  };
}

const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log(`new connection ${socket.id}`);

  socket.join('123');

  socket.on('start game', data => {
    io.to('123').emit('game started', makeFood());
  });

  socket.on('end game', data => {
    io.to('123').emit('game ended', data);
  });

  socket.on('snake1dirchanged', data => {
    io.to('123').emit('snake1dirchanged', data);
  });
  socket.on('snake2dirchanged', data => {
    io.to('123').emit('snake2dirchanged', data);
  });

  socket.on('eat food', eatenBy => {
    io.to('123').emit('food eaten', [eatenBy, makeFood()]);
  });
}

app.use(express.static('public'));