'use strict';

const express = require('express');
const router = express.Router();

const paymentIntentController = require('../../../../../pages/api/create-payment-intent');

// Ensure POST requests are being logged and handled correctly
router.post('/create-payment-intent', async (req, res) => {
  console.log('[GT][payment.js] Handling POST /create-payment-intent');
  try {
    console.log('[GT][payment.js] Request received with method:', req.method);
    console.log('[GT][payment.js] Request received with headers:', req.headers);
    console.log('[GT][payment.js] Request received with body:', req.body);
    
    await paymentIntentController(req, res);
  } catch (error) {
    console.error('[GT][payment.js] Error handling POST /create-payment-intent:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
