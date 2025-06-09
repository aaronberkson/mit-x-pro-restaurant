import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("../src/routes/index.jsx"), // Home page
  route("checkout", "../src/routes/checkout.jsx"), // Checkout page
  route("restaurant/:id", "../src/routes/restaurant.jsx"), // Dynamic route
] satisfies RouteConfig;
