import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppProvider } from "./components/context"; // Unified AppContext
import { RestaurantIDProvider } from "./hooks/useRestaurantID"; // Import the provider
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"; // Apollo setup
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Index from "./routes/index.jsx";
import Checkout from "./routes/checkout.jsx";
import Preloader from "./components/preloader.jsx"; // Import Preloader component
import "../styles/globals.css"; // Global styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles

// [GT][App] Initializing Apollo Client
const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_API_URL, // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

// [GT][App] Initializing Stripe with public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
console.log("[GT][App] Stripe initialized with public key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Static images to preload
const staticImages = [
  "/images/black-slate-bg-min.webp",
  "/images/credit-card-w-stripe-logo.svg",
  "/images/gravytrain-logo-no-smoke.svg",
  "/images/powered_by_stripe-white.svg",
  "/images/shield-green-w-check-stripecolors.svg",
  "/images/stripe_wordmark-white.svg",
];

function App() {
  console.log("[GT][App] App component rendered."); // Log added

  return (
    <ApolloProvider client={apolloClient}>
      <AppProvider>
        <RestaurantIDProvider>
          <Preloader apiUrl={import.meta.env.VITE_API_URL} staticImages={staticImages}>
            <Elements stripe={stripePromise}>
              <Router>
                {console.log("[GT][App] Router initialized.")} {/* Log added */}
                <Routes>
                  {console.log("[GT][App] Defining application routes.")} {/* Log added */}
                  {/* Home route */}
                  <Route path="/" element={<Index />} />
                  {console.log("[GT][App] Home route ('/') added.")} {/* Log added */}

                  {/* Checkout route */}
                  <Route path="/checkout" element={<Checkout />} />
                  {console.log("[GT][App] Checkout route ('/checkout') added.")} {/* Log added */}
                </Routes>
              </Router>
            </Elements>
          </Preloader>
        </RestaurantIDProvider>
      </AppProvider>
    </ApolloProvider>
  );
}

export default App;
