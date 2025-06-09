const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();

// Configure CORS to allow requests from frontend origins
app.use(cors({
  origin: [
    'https://mit-xpro-restaurant.aaronberkson.io' // Allow the production frontend only
  ],
  methods: ['GET', 'POST', 'OPTIONS'], // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type'],    // Allow Content-Type header
  credentials: true,                   // Support credentials
}));

// Handle preflight requests for CORS
app.options('*', (req, res) => {
  console.log(`[GT][stripe-server] Preflight OPTIONS request to ${req.url}`);
  res.sendStatus(200); // Send a success response
});

// Parse incoming request bodies as JSON
app.use(bodyParser.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[GT][stripe-server] Incoming ${req.method} request to ${req.url}`);
  next();
});

// Load route handlers
const createPaymentIntent = require('./create-payment-intent');
const logStripe = require('./log-stripe');

// Define API routes
app.post('/api/create-payment-intent', createPaymentIntent);
app.post('/api/log-stripe', logStripe);

// Check environment variables for debugging
console.log('[GT][stripe-server] Stripe Secret Key:', process.env.STRIPE_SECRET_KEY || 'Not defined');
console.log('[GT][stripe-server] Frontend URLs:', 'https://mit-xpro-restaurant.aaronberkson.io');

// Start the server
const port = process.env.PORT || 4242;
app.listen(port, () => {
  console.log(`Stripe server running on port ${port}`);
});
