'use strict';

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('[GT][create-payment-intent] Stripe initialized:', stripe !== undefined);

module.exports = async (req, res) => {
  console.log('[GT][create-payment-intent] This log confirms the file is invoked');

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[GT][create-payment-intent] STRIPE_SECRET_KEY is not defined in the environment');
    return res.status(500).send({ error: 'Stripe configuration error' });
  }

  if (req.headers['content-type'] !== 'application/json') {
    console.error('[GT][create-payment-intent] Invalid content type:', req.headers['content-type']);
    return res.status(400).send({ error: 'Content-Type must be application/json' });
  }
  console.log('[GT][create-payment-intent] Content-Type is valid');

  if (req.method !== 'POST') {
    console.log('[GT][create-payment-intent] Method Not Allowed');
    return res.status(405).send({ error: 'Method Not Allowed' });
  }

  console.log('[GT][create-payment-intent] POST method confirmed');

  try {
    console.log('[GT][create-payment-intent] Incoming Request Body:', req.body);

    const { amount, currency = 'usd' } = req.body;
    console.log('[GT][create-payment-intent] Amount:', amount, 'Currency:', currency);

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Amount is required and must be a positive number');
    }
    if (!currency) {
      throw new Error('Currency is required and must follow ISO 4217 (e.g., "usd")');
    }
    console.log('[GT][create-payment-intent] Input validation passed.');

    const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    console.log('[GT][create-payment-intent] PaymentIntent created:', paymentIntent.id);
    console.log('[GT][create-payment-intent] Full PaymentIntent response:', paymentIntent);

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('[GT][create-payment-intent] Error:', error.message);

    if (error.type === 'StripeCardError') {
      console.error('[GT][create-payment-intent] StripeCardError:', error.message);
      return res.status(400).send({ error: 'Card error during PaymentIntent creation' });
    }

    if (error.type === 'StripeInvalidRequestError') {
      console.error('[GT][create-payment-intent] StripeInvalidRequestError:', error.message);
      return res.status(400).send({ error: 'Invalid request to Stripe' });
    }

    res.status(500).send({ error: 'An unexpected error occurred' });
  }
};
