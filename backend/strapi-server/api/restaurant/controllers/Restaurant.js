'use strict';

/**
 * A set of functions called "actions" for `restaurant`
 */

module.exports = {
  // Example function to fetch restaurant details
  async fetchRestaurantDetails(ctx) {
    const restaurant = await strapi.services.restaurant.find();
    ctx.send(restaurant);
  },
};
