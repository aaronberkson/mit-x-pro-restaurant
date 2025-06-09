const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Socket Server is running');
});

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.emit('log', { message: 'Stripe payment succeeded!' });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Socket server running on port 4000');
});

module.exports = server;  // Export the server if you need to use it elsewhere
