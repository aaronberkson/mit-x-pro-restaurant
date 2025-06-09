'use strict';

/**
 * A set of functions called "actions" for `dish`
 */

module.exports = {
  // Example function to fetch dish by UID
  async findDishByUID(ctx) {
    const { UID_Dish } = ctx.params;
    const dish = await strapi.services.dish.findOne({ UID_Dish });

    if (!dish) {
      return ctx.throw(404, 'Dish not found');
    }

    ctx.send(dish);
  },
};
