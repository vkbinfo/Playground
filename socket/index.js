const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('The connection is disconnected with the socket');
  });

  socket.on('chat message', (message) => {
    console.log('The message receieved from one client', message);
    socket.broadcast.emit('chat message', message);
  })
})

http.listen(3000, function () {
  console.log('Listening on *.:3000');
})
