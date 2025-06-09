import React, { useContext, useEffect, useCallback } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutForm";
import { CartContext, UserContext } from "../components/context";
import Cart from "../components/cart";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion"; // Import Framer Motion for animations

// [GT][Checkout] Import environment variables for dynamic URLs
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const STRAPI_URL = import.meta.env.VITE_API_URL;
const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_API_URL;

console.log("[GT][Checkout] Stripe initialized with public key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Create a Strapi order
const createStrapiOrder = async (orderData) => {
  try {
    console.log("[GT][Checkout] Sending order data to Strapi:", orderData);
    const response = await fetch(`${STRAPI_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    const responseData = await response.json();
    console.log("[GT][Checkout] Order created successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("[GT][Checkout] Error creating order:", error.message);
    return null;
  }
};

function Checkout() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { isAuthenticated } = useContext(UserContext);

  console.log("[GT][Checkout] Cart state at render:", cart);
  console.log("[GT][Checkout] User isAuthenticated:", isAuthenticated);

  useEffect(() => {
    console.log("[GT][Checkout] Checkout page loaded. Setting document title.");
    document.title = "GravyTrain - Checkout";
    return () => {
      console.log("[GT][Checkout] Cleaning up. Resetting document title.");
      document.title = "GravyTrain";
    };
  }, []);

  const createPaymentIntent = useCallback(async (amount) => {
    try {
      console.log("[GT][Checkout] Creating Payment Intent for amount:", amount);
      console.log("[GT][Checkout] Payment API URL:", PAYMENT_API_URL);

      const response = await fetch(
        `${PAYMENT_API_URL}/api/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("[GT][Checkout] Failed to create Payment Intent:", errorBody);
        return null;
      }
      const { clientSecret } = await response.json();
      console.log("[GT][Checkout] Payment Intent created successfully. Client Secret:", clientSecret);
      return clientSecret;
    } catch (error) {
      console.error("[GT][Checkout] Error creating Payment Intent:", error.message);
      return null;
    }
  }, []);

  // Validate cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    console.error("[GT][Checkout] Cart is empty or invalid.");
    return (
      <Container style={{ textAlign: "center", marginTop: "20px" }}>
        <h1
          style={{
            color: "white",
            fontWeight: "600",
            fontFamily: "Nunito, sans-serif",
            textAlign: "center",
            textShadow: "1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black",
          }}
        >
          Your cart is empty. Add items before checking out!
        </h1>
      </Container>
    );
  }

  return (
    <Container fluid style={{ padding: 0, marginLeft: "-21.5px", marginRight: "0px" }}>
      <Row className="justify-content-center" style={{ margin: 0 }}>
        <Col xs={12} md={8} style={{ padding: 0 }}>
          <Container style={{ padding: 0 }}>
            <Row style={{ margin: 0, padding: 0 }}>
              <Col xs={12} style={{ padding: "20px 0" }}>
                {/* Back Button with Slide-In Animation */}
                <motion.div
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 17,
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={() => navigate("/")}
                    style={{
                      marginBottom: "10px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                    }}
                    size="sm"
                  >
                    <FaArrowLeft style={{ marginRight: "5px" }} />
                    Back
                  </Button>
                </motion.div>

                {/* Checkout Title with Wipe Reveal Animation */}
                <motion.div
                  initial={{ clipPath: "inset(0 100% 0 0)" }} // Hidden to the right
                  animate={{ clipPath: "inset(0 0% 0 0)" }} // Revealing left to right
                  transition={{
                    duration: 0.45, // Speed up the wipe effect
                    ease: "easeInOut", // Balanced easing
                  }}
                  style={{
                    overflow: "hidden", // Prevent artifacts
                    display: "inline-block", // Dynamically fit the content
                    lineHeight: "1.2", // Ensure proper height adjustment for text
                    paddingBottom: "0", // Remove unnecessary padding below
                    marginBottom: "0", // Reduce space between the text and cards
                  }}
                >
                  <h1
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontFamily: "Nunito, sans-serif",
                      margin: "0", // Reset margins to prevent excess space
                      padding: "0", // Ensure no additional padding
                      textAlign: "left",
                      textShadow: "1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black",
                    }}
                  >
                    Checkout
                  </h1>
                </motion.div>
              </Col>
            </Row>
            <Row className="align-items-start" style={{ margin: 0, padding: 0 }}>
              <Col xs={12} sm={6} style={{ paddingLeft: "1px", marginBottom: "20px" }}>
                <Cart isAuthenticated={isAuthenticated} headerAnimationDelay={0} />
              </Col>
              <Col
                xs={12}
                sm={6}
                style={{
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    createPaymentIntent={createPaymentIntent}
                    createStrapiOrder={createStrapiOrder}
                  />
                </Elements>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
