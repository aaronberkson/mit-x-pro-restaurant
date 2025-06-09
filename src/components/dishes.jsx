import React, { useEffect, useContext, memo } from "react";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import { Button, CardImg, Container } from "reactstrap";
import {
  useHoverStates,
  useActiveStates,
  useRestaurantSelection,
  CartContext,
} from "./context";

// Import API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Fixed animation constants
const CASCADE_DELAY = 0.15; // Delay between each card's animation
const CARD_ANIMATION_DURATION = 0.35; // Duration for the slide-in effect
const CARD_ANIMATION_EASING = [0.3, 0.15, 0.3, 1]; // Gradual ease-in and ease-out

// Motion variants for dish cards
const dishCardVariants = {
  hidden: { opacity: 0, x: -120 }, // Start off-screen to the left
  visible: { opacity: 1, x: 0 }, // Slide into place
};

// GraphQL query to fetch dishes for a specific restaurant
const GET_RESTAURANT_DISHES = gql`
  query($RestID: String!) {
    dishes(filters: { RestID: { eq: $RestID } }) {
      UID_Dish
      Name
      Description
      Price
      Image {
        url
      }
    }
  }
`;
const Dishes = memo(() => {
  // Access cart functionality from CartContext
  const { addItem } = useContext(CartContext);

  // Access restaurantID from RestaurantSelectionContext
  const { restaurantID } = useRestaurantSelection();

  // Access hover and active states from respective contexts
  const { hoverStates, setHoverStates } = useHoverStates();
  const { activeStates, setActiveStates } = useActiveStates();

  const { loading, error, data, refetch } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { RestID: restaurantID },
    skip: !restaurantID, // Skip the query if restaurantID is null
  });

  useEffect(() => {
    console.log("[GT][Dishes] Received restaurantID:", restaurantID);
    if (restaurantID) {
      console.log("[GT][Dishes] Fetching dishes for restaurantID:", restaurantID);
      refetch(); // Refetch dishes when restaurantID changes
    } else {
      console.warn("[GT][Dishes] restaurantID is null, skipping fetch.");
    }
  }, [restaurantID, refetch]);

  if (error) {
    console.error("[GT][Dishes] Error fetching dishes:", error.message, error);
    return <p>Error loading dishes.</p>;
  }

  if (loading) return <p>Loading...</p>;

  if (!data || !data.dishes) return <p>&nbsp;</p>;

  const handleAddItem = (dish) => {
    console.log("[GT][Dishes] Adding to cart:", dish);
    addItem(dish);
  };
  const containerStyle = {
    maxWidth: "852px",
    margin: "9px 0 0 0px",
    padding: "0px",
    width: "865px",
  };

  const flexContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "flex-start",
  };

  return (
    <Container style={containerStyle}>
      <div style={flexContainerStyle}>
        {data.dishes.map((dish, index) => (
          <motion.div
            key={dish.UID_Dish}
            initial="hidden"
            animate="visible"
            variants={dishCardVariants}
            transition={{
              delay: index * CASCADE_DELAY, // Cascading effect like restaurants.jsx
              duration: CARD_ANIMATION_DURATION, // Animation duration per card
              ease: CARD_ANIMATION_EASING, // Easing effect
            }}
            style={{
              flex: "1 1 calc(33.33% - 20px)", // Three cards per row with a gap
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#5D6D7E",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid whitesmoke",
              boxSizing: "border-box",
              borderRadius: "10px",
              boxShadow: "6px 6px 9px rgba(0, 0, 0, 0.7)", // Consistent drop shadow style
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "100%", // Square aspect ratio
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector(".dishInfoTop").style.display =
                  "flex";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector(".dishInfoTop").style.display =
                  "none";
              }}
            >
              <CardImg
                top={true}
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={`${API_URL}${dish.Image.url}`} // Use the imported API_URL
                alt={dish.Name}
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
              <div
                className="dishInfoTop"
                style={{
                  position: "absolute",
                  top: "0",
                  width: "100%",
                  height: "80%",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  display: "none",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <div>{dish.Description}</div>
                <Button
                  style={{
                    backgroundColor: "#007BFF",
                    border: "none", // Ensure no border appears
                    outline: "none", // Prevent focus outline on click
                    color: "white",
                    fontWeight: "700",
                    boxShadow: "none", // Remove any lingering box-shadow
                    transition: "background 0.2s, transform 0.1s", // Smooth transitions for hover/mousedown
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0056b3"; // Hover state styling
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#007BFF"; // Reset to default styling
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = "#004085"; // Active state styling
                    e.currentTarget.style.transform = "scale(0.98)"; // Slight scale effect
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = "#0056b3"; // Reset to hover styling
                    e.currentTarget.style.transform = "scale(1)"; // Reset scale
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = "#004085"; // Active state for touch devices
                    e.currentTarget.style.transform = "scale(0.98)";
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.backgroundColor = "#0056b3"; // Reset to hover styling for touch devices
                    e.currentTarget.style.transform = "scale(1)";
                    handleAddItem(dish); // Handle adding to cart
                  }}
                  onClick={() => handleAddItem(dish)} // Regular click handler
                >
                  + Add to Cart
                </Button>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  width: "100%",
                  height: "20%",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px",
                }}
              >
                <span>{dish.Name}</span>
                <span>${dish.Price.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
});

export default Dishes;
