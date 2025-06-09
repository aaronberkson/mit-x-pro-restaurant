"use strict";

import { config } from 'dotenv';
import Stripe from 'stripe';

// Adjust the path to point to the .env.local file at the root directory level of the project
config({ path: '../../../../.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  console.log("Back-End Order.js: createOrder function invoked");  // Log to server console for additional verification
  req.app.io.emit('log', 'Back-End | Order controller – createOrder function invoked');
  
  const { address, amount, dishes, token, city, state } = JSON.parse(req.body);
  const stripeAmount = Math.floor(amount * 100);

  req.app.io.emit('log', `Back-End | Order controller – Received order request: ${JSON.stringify({ address, amount, dishes, token, city, state })}`);
  req.app.io.emit('log', `Back-End | Order controller – Stripe Secret Key: ${process.env.STRIPE_SECRET_KEY}`);  // Ensure key is loaded correctly

  try {
    // Validate each dish in the order
    for (const dish of dishes) {
      const validDish = await strapi.services.dish.findOne({ UID_Dish: dish.UID_Dish });
      if (!validDish) {
        req.app.io.emit('log', `Back-End | Order controller – Error: Dish with UID ${dish.UID_Dish} not found`);
        return res.status(400).json({ error: `Dish with UID ${dish.UID_Dish} not found` });
      }
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: "usd",
      payment_method: token,
      confirmation_method: "automatic",
      confirm: true,
    });

    req.app.io.emit('log', `Back-End | Order controller – PaymentIntent created: ${JSON.stringify(paymentIntent)}`);

    // Register the order in the database
    const order = await strapi.services.order.create({
      user: req.state.user.id,
      payment_intent_id: paymentIntent.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state,
    });

    req.app.io.emit('log', `Back-End | Order controller – Order created in Strapi: ${JSON.stringify(order)}`);

    // Emit order created event
    req.app.io.emit('orderCreated', order);

    res.status(200).json({ order, paymentIntent });
  } catch (error) {
    req.app.io.emit('log', `Back-End | Order controller – Error creating order: ${JSON.stringify(error)}`);
    res.status(500).end("Unable to create order");
  }
};
