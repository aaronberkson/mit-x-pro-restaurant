import React, { useState, useCallback, useEffect } from "react";
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js"; // Correct import for loadStripe
import { Elements } from "@stripe/react-stripe-js";
import Restaurants from "../components/restaurants"; // Updated import
import Dishes from "../components/dishes";
import Layout from "../components/layout";
import Cart from "../components/cart";
import { Row, Col } from "react-bootstrap";
import { useRestaurantID } from "../hooks/useRestaurantID"; // Import custom hook
import { SearchProvider } from "../components/searchContext"; // Import SearchProvider

// [GT][index] Import environment variables for dynamic URLs
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const API_URL = import.meta.env.VITE_API_URL; // API base URL for GraphQL

console.log("[GT][index] Stripe initialized with public key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Index() {

  // [GT][index] API URL being used for GraphQL
  console.log("[GT][index] API URL for GraphQL:", API_URL);

  const [query, setQuery] = useState(""); // Manage search queries
  const [searchTriggered, setSearchTriggered] = useState(false); // Track search form submissions
  const { restaurantID, updateRestaurantID } = useRestaurantID(); // Use hook for restaurantID

  // Initialize Apollo Client for GraphQL
  const client = new ApolloClient({
    link: new HttpLink({ uri: `${API_URL}/graphql` }),
    cache: new InMemoryCache(),
  });
  console.log("[GT][index] Apollo Client initialized with GraphQL endpoint:", `${API_URL}/graphql`);

  // Handle restaurant selection using the hook
  const handleRestaurantSelect = useCallback((id) => {
    console.log("[GT][Index] Restaurant selected. Updating restaurantID to:", id);
    updateRestaurantID(id); // Use the hook to update restaurantID
  }, [updateRestaurantID]);

  const triggerSearch = () => {
    setSearchTriggered(true);
    console.log("[GT][index] Search triggered with query:", query); // Log added
  };

  console.log("[GT][Index] Current restaurantID (from hook):", restaurantID); // Log current restaurantID

  return (
    <ApolloProvider client={client}>
      {console.log("[GT][index] ApolloProvider rendered.")} {/* Log added */}
      <Elements stripe={stripePromise}>
        {console.log("[GT][index] Elements wrapper rendered.")} {/* Log added */}
        <SearchProvider> {/* Wrap the entire app with SearchProvider */}
          <Layout setQuery={setQuery} triggerSearch={triggerSearch}>
            {console.log("[GT][index] Layout component rendered.")} {/* Log added */}
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                marginTop: "10px",
                padding: "0 15px",
              }}
            >
              <Row style={{ margin: "0", padding: "0", marginLeft: "22px" }}>
                {console.log("[GT][index] Rendering main content area.")} {/* Log added */}
                <Col md={9} style={{ padding: "0" }}>
                  <Restaurants
                    query={query}
                    searchTriggered={searchTriggered}
                    onRestaurantSelect={handleRestaurantSelect} // Pass handleRestaurantSelect
                    selectedRestaurantID={restaurantID} // Use restaurantID from hook
                  />
                  {console.log("[GT][index] Restaurants component rendered with query:", query)} {/* Log added */}
                  <Dishes restId={restaurantID} /> {/* Use restaurantID from hook */}
                  {console.log("[GT][index] Dishes component rendered with restaurantID:", restaurantID)} {/* Log added */}
                </Col>
                <Col md={3} style={{ padding: "0" }}>
                <Cart headerAnimationDelay={0.5} />
                  {console.log("[GT][index] Cart component rendered.")} {/* Log added */}
                </Col>
              </Row>
            </div>
          </Layout>
        </SearchProvider>
      </Elements>
    </ApolloProvider>
  );
}

export default Index;
