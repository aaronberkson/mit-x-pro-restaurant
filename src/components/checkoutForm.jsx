import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Form, FormControl, Button, Alert } from "react-bootstrap";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { v4 as uuidv4 } from "uuid";
import { CartContext } from "./context"; // Replace AppContext with CartContext
import CheckoutFormAnimation from "./checkoutFormAnimation";
import { CardTooltip } from "./checkoutFormValidation";
import CheckoutFormSuccess from "./checkoutFormSuccess";
import CheckoutFormError from "./checkoutFormError";

const showBorders = false;

function CheckoutForm({ createPaymentIntent, createStrapiOrder }) {
  const [data, setData] = useState({ address: "", city: "", state: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useContext(CartContext); // Use CartContext to access cart state

  useEffect(() => {
    console.log("[GT][CheckoutForm] Component mounted with cart state:", cart);
  }, [cart]);

  function onChange(e) {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function submitOrder(event) {
    event.preventDefault();
    console.log("[GT][CheckoutForm] Submit Order triggered.");

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError("Card information is required.");
      console.error("[GT][CheckoutForm] Card information is missing.");
      return;
    }

    console.log("[GT][CheckoutForm] Card element retrieved successfully.");

    const clientSecret = await createPaymentIntent(Math.round(cart.total * 100)); // Using cart state from CartContext
    if (!clientSecret) {
      setError("Unable to create Payment Intent. Please try again.");
      console.error("[GT][CheckoutForm] Failed to get clientSecret.");
      return;
    }

    console.log("[GT][CheckoutForm] Received clientSecret:", clientSecret);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setError(stripeError.message);
        console.error("[GT][CheckoutForm] Stripe error:", stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setError("");
        setSuccess(true);
        console.log("[GT][CheckoutForm] Payment succeeded.");

        const orderData = {
          data: {
            UID_Order: uuidv4(),
            Address: data.address,
            City: data.city,
            State: data.state,
            Dishes: cart.items, // Accessing cart items
            Amount: cart.total, // Accessing cart total
            Token: paymentIntent.id,
            Charge_ID: paymentIntent.id,
            User: "generic.user@example.com", // Placeholder
          },
        };

        console.log("[GT][CheckoutForm] Sending order data to Strapi:", orderData);
        await createStrapiOrder(orderData);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error("[GT][CheckoutForm] Error during payment:", err.message);
    }
  }
  return (
  <CheckoutFormAnimation>
    <div
      style={{
        border: showBorders ? "1px solid lightgray" : "none",
        boxShadow:
          "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)",
        height: "585px",
        padding: "30px",
        background: "#343a40",
        color: "white",
        borderRadius: "6px",
        marginTop: "0px",
        width: "450px",
      }}
    >
      <h5
        style={{
          color: "white",
          fontWeight: "600",
          marginLeft: "0px",
        }}
      >
        Your Information
      </h5>
      <hr
        style={{
          borderColor: "white",
          borderWidth: "3px",
          marginBottom: "8px",
        }}
      />
      <Form style={{ margin: "0px", padding: "0px" }}>
        <Row
          className="mb-3"
          style={{
            alignItems: "center",
            margin: "0px",
            paddingTop: "5px",
          }}
        >
          <Col xs="12" style={{ padding: "0px" }}>
            <Form.Label
              style={{
                color: "white",
                fontWeight: "300",
                letterSpacing: "0.025em",
                whiteSpace: "nowrap",
                marginBottom: "6px",
                marginLeft: "0px",
              }}
            >
              Address
            </Form.Label>
            <FormControl
              name="address"
              type="text"
              placeholder="Enter your address"
              onChange={onChange}
              value={data.address}
              style={{
                height: "36px",
                borderRadius: "5px",
                marginLeft: "0px",
                marginBottom: "15px",
                backgroundColor: "black",
                color: "white",
              }}
            />
          </Col>
        </Row>
        {/* City and State Inputs */}
        <Row
          className="mb-3"
          style={{
            alignItems: "baseline",
            margin: "0px",
            paddingTop: "4px",
          }}
        >
          <Col xs="8" style={{ padding: "0px" }}>
            <Form.Label
              style={{
                color: "white",
                fontWeight: "300",
                marginBottom: "6px",
                marginLeft: "0px",
              }}
            >
              City
            </Form.Label>
            <FormControl
              name="city"
              type="text"
              placeholder="Enter your city"
              onChange={onChange}
              value={data.city}
              style={{
                height: "36px",
                width: "250px",
                borderRadius: "5px",
                marginLeft: "0px",
                marginBottom: "18px",
                backgroundColor: "black",
                color: "white",
              }}
            />
          </Col>
          <Col xs="4" style={{ padding: "0px" }}>
            <Form.Label
              style={{
                color: "white",
                fontWeight: "300",
                marginBottom: "6px",
                marginLeft: "0px",
              }}
            >
              State
            </Form.Label>
            <Form.Select
              name="state"
              onChange={onChange}
              value={data.state}
              style={{
                height: "36px",
                borderRadius: "5px",
                marginLeft: "0px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <option value="" disabled>
                Select
              </option>
              {[
                "AL",
                "AK",
                "AZ",
                "AR",
                "CA",
                "CO",
                "CT",
                "DE",
                "FL",
                "GA",
                "HI",
                "ID",
                "IL",
                "IN",
                "IA",
                "KS",
                "KY",
                "LA",
                "ME",
                "MD",
                "MA",
                "MI",
                "MN",
                "MS",
                "MO",
                "MT",
                "NE",
                "NV",
                "NH",
                "NJ",
                "NM",
                "NY",
                "NC",
                "ND",
                "OH",
                "OK",
                "OR",
                "PA",
                "RI",
                "SC",
                "SD",
                "TN",
                "TX",
                "UT",
                "VT",
                "VA",
                "WA",
                "WV",
                "WI",
                "WY",
              ].map((stateCode) => (
                <option key={stateCode} value={stateCode}>
                  {stateCode}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {/* Stripe Payment Elements */}
        <Row
          className="mb-3"
          style={{
            alignItems: "center",
            margin: "0px",
            paddingTop: "4px",
          }}
        >
          <Col xs="6" style={{ padding: "0px" }}>
            <Form.Label
              style={{
                color: "white",
                fontWeight: "300",
                marginBottom: "3px",
                marginLeft: "0px",
              }}
            >
              Credit Card
            </Form.Label>
            <CardTooltip>
              <div
                style={{
                  height: "36px",
                  width: "185px",
                  backgroundColor: "black",
                  color: "white",
                  margin: "0px",
                  padding: "10px 14px",
                  fontSize: "1em",
                  border: "1px solid white",
                  borderRadius: "4px",
                }}
                autoComplete="new-card" // Prevents autofill
              >
                <CardNumberElement />
              </div>
            </CardTooltip>
          </Col>
          <Col xs="3" style={{ padding: "0px" }}>
            <Form.Label
              style={{
                color: "white",
                fontWeight: "300",
                marginBottom: "3px",
                marginLeft: "0px",
              }}
            >
              Expiration
            </Form.Label>
            <div
              style={{
                height: "36px",
                width: "88px",
                backgroundColor: "black",
                color: "white",
                margin: "0px",
                padding: "10px 14px",
                fontSize: "1em",
                border: "1px solid white",
                borderRadius: "4px",
              }}
            >
              <CardExpiryElement />
            </div>
          </Col>
          <Col xs="3" style={{ padding: "0px" }}>
            <Form.Label
              style={{
                color: "white",
                fontWeight: "300",
                marginBottom: "3px",
                marginLeft: "0px",
              }}
            >
              CVC
            </Form.Label>
            <div
              style={{
                height: "36px",
                backgroundColor: "black",
                color: "white",
                margin: "0px",
                padding: "10px 14px",
                fontSize: "1em",
                border: "1px solid white",
                borderRadius: "4px",
              }}
            >
              <CardCvcElement />
            </div>
          </Col>
        </Row>

        {/* Confirm Order Button */}
        <Row
          className="mb-3"
          style={{
            alignItems: "center",
            margin: "0px",
            paddingTop: "15px",
          }}
        >
          <Col
            className="d-flex align-items-center"
            style={{ padding: "0px", marginTop: "0px" }}
          >
            <Button
              variant="primary"
              type="submit"
              disabled={!stripe}
              onClick={submitOrder}
              style={{
                background: "linear-gradient(180deg, #9B30FF, #551A8B)",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "15px",
                border: "none", // Remove border completely
                outline: "none", // Prevent focus outline
                boxShadow: "none", // Remove any lingering box-shadow
                padding: "10px 20px",
                marginLeft: "0px",
                marginTop: "0px",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(180deg, #B244FF, #6D28B3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(180deg, #9B30FF, #551A8B)";
              }}
              onMouseDown={(e) => {
                e.target.style.background =
                  "linear-gradient(180deg, #7C25CC, #47167A)";
                e.target.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.target.style.background =
                  "linear-gradient(180deg, #B244FF, #6D28B3)";
                e.target.style.transform = "scale(1)";
              }}
            >
              Confirm Order
            </Button>
            <img
              src="/images/powered_by_stripe-white.svg"
              alt="Powered by Stripe"
              style={{
                marginLeft: "10px",
                height: "30px",
              }}
            />
          </Col>
        </Row>

        {/* Error and Success Messages */}
        {error && (<CheckoutFormError error={error} />)}
        {success && <CheckoutFormSuccess />}

      </Form>
    </div>
  </CheckoutFormAnimation>
  );
}

export default CheckoutForm;
