// backend/restaurant/setupStrapi.js
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const strapi = require('strapi');
const http = require('http');

// Function to log to file
function logToFile(message) {
  const logPath = path.resolve(__dirname, 'track-stripe-log.txt');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

logToFile('[GT][setupStrapi.js] Loaded environment variables');
logToFile('[GT][setupStrapi.js] STRIPE_SECRET_KEY: ' + process.env.STRIPE_SECRET_KEY);

// Create HTTP server and Socket.io setup
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket server is running');
});

// Initialize the Socket.io server
const io = socketIo(server);

// Setup socket event listeners
io.on('connection', (socket) => {
  console.log('[GT][setupStrapi.js] New client connected');

  // Example: emitting events to the client
  socket.emit('log', { message: 'Stripe payment succeeded!' });

  socket.on('disconnect', () => {
    console.log('[GT][setupStrapi.js] Client disconnected');
  });
});

// Start Strapi app on a different port (Strapi default is 1337)
strapi()
  .start()
  .then(() => {
    logToFile('[GT][setupStrapi.js] Strapi server started successfully');
    // Start the Socket.io HTTP server (on port 4000)
    server.listen(4000, () => {
      logToFile('[GT][setupStrapi.js] Socket server running on port 4000');
    });
  })
  .catch((error) => logToFile('[GT][setupStrapi.js] Strapi startup error: ' + error.message));
