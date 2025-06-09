"use strict";

import { config } from 'dotenv';
import Stripe from 'stripe';

config({ path: '../../../../.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const testStripeConnection = async (req, res) => {
  console.log("Back-End | TestController: testStripeConnection function invoked");
  req.app.io.emit('log', 'Back-End | TestController – testStripeConnection function invoked');
  
  // Test creating a customer
  try {
    const customer = await stripe.customers.create({
      description: 'Test Customer',
      email: 'test@example.com',
    });

    req.app.io.emit('log', `Back-End | TestController – Stripe Customer created: ${JSON.stringify(customer)}`);
    return res.status(200).json({ success: true, customer });
  } catch (error) {
    req.app.io.emit('log', `Back-End | TestController – Error creating Stripe Customer: ${JSON.stringify(error)}`);
    return res.status(500).json({ success: false, error: error.message });
  }
};
