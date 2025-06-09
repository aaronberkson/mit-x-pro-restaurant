import React, { useEffect, useMemo, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import {
  useRestaurantSelection,
  useHoverStates,
  useActiveStates,
} from "./context";
import { useSearchContext } from "./searchContext";

// Import API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// GraphQL query to fetch restaurants
const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      UID_Restaurant
      Name
      Description
      Image {
        url
      }
    }
  }
`;

// Fixed animation constants
const CASCADE_DELAY = 0.15; // Delay between each card's animation
const CARD_ANIMATION_DURATION = 0.35; // Duration for the slide-in effect
const CARD_ANIMATION_EASING = [0.3, 0.15, 0.3, 1]; // Gradual ease-in and stronger ease-out

// Motion variants for restaurant cards
const restaurantCardVariants = {
  hidden: { opacity: 0, x: -120 }, // Start further off-screen to the left
  visible: { opacity: 1, x: 0 }, // Slide into view
};
const RestaurantCard = React.memo(
  ({ restaurant, isSelected, onSelect }) => {
    const { hoverStates, setHoverStates } = useHoverStates();
    const { activeStates, setActiveStates } = useActiveStates();

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={restaurantCardVariants} // Apply slide-in animation variants
        transition={{
          duration: CARD_ANIMATION_DURATION, // Use updated animation duration
          ease: CARD_ANIMATION_EASING, // Apply the configurable easing style
        }}
        style={{
          backgroundColor: "#343a40",
          color: "white",
          padding: "15px",
          border: isSelected ? "2px solid #FF2D55" : "1px solid whitesmoke",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          boxShadow: "6px 6px 9px rgba(0, 0, 0, 0.7)", // Stronger shadow for high visibility
          zIndex: 1, // Ensure the card and shadow are above other elements
          maxWidth: "300px", // Set the maximum width of each card
        }}
        onMouseEnter={() =>
          setHoverStates((prev) => ({
            ...prev,
            [restaurant.UID_Restaurant]: true,
          }))
        }
        onMouseLeave={() =>
          setHoverStates((prev) => ({
            ...prev,
            [restaurant.UID_Restaurant]: false,
          }))
        }
        onMouseDown={() =>
          setActiveStates((prev) => ({
            ...prev,
            [restaurant.UID_Restaurant]: true,
          }))
        }
        onMouseUp={() =>
          setActiveStates((prev) => ({
            ...prev,
            [restaurant.UID_Restaurant]: false,
          }))
        }
      >
        <img
          style={{
            objectFit: "cover",
            width: "100%",
            height: "auto",
            borderRadius: "8px 8px 0 0",
          }}
          src={`${API_URL}${restaurant.Image.url}`} // Use the imported API_URL
          alt={restaurant.Name}
          onError={(e) => (e.target.src = "/fallback-image.jpg")}
        />
        <div
          style={{
            padding: "10px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "14px", marginBottom: "10px", color: "white" }}>
            {restaurant.Description}
          </p>
          <button
            style={{
              backgroundColor: activeStates[restaurant.UID_Restaurant]
                ? "#cc0000"
                : hoverStates[restaurant.UID_Restaurant]
                ? "#e60026"
                : "#FF2D55",
              border: "none",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
              fontWeight: 600,
              transition: "background-color 0.3s ease-in-out",
            }}
            onClick={() => onSelect(restaurant.UID_Restaurant)}
          >
            Select
          </button>
        </div>
      </motion.div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected // Only re-render if selection changes
);
const Restaurants = () => {
  const { searchQuery } = useSearchContext();
  console.log("[GT][Restaurants][SearchContext] Current searchQuery:", searchQuery);

  const { restaurantID, setRestaurantID } = useRestaurantSelection();
  const { loading, error, data } = useQuery(GET_RESTAURANTS);

  useEffect(() => {
    console.log("[GT][Restaurants][SearchContext] useQuery loading:", loading);
    console.log("[GT][Restaurants][SearchContext] useQuery error:", error);
    console.log("[GT][Restaurants][SearchContext] useQuery data:", data);
  }, [loading, error, data]);

  // Filter restaurants by name
  const filteredRestaurants = useMemo(() => {
    if (!data || !data.restaurants) {
      console.warn("[GT][Restaurants][SearchContext] No restaurants found.");
      return [];
    }
    const results = data.restaurants.filter((res) =>
      res.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("[GT][Restaurants][SearchContext] Filtered results:", results);
    return results;
  }, [data, searchQuery]);

  useEffect(() => {
    // Clear restaurantID only if it doesn’t correspond to any filtered results
    const isSelectedRestaurantInResults = filteredRestaurants.some(
      (res) => res.UID_Restaurant === restaurantID
    );
    if (!isSelectedRestaurantInResults && restaurantID) {
      console.log("[GT][Restaurants][SearchContext] Clearing selected restaurant due to mismatch with search results.");
      setRestaurantID(null);
    }
  }, [filteredRestaurants, restaurantID, setRestaurantID]);

  // Handle restaurant selection
  const handleButtonClick = useCallback(
    (id) => {
      console.log("[GT][Restaurants][SearchContext] Restaurant selected:", id);
      setRestaurantID(id);
    },
    [setRestaurantID]
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "white" }}>
        <p>&nbsp;</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        <p>Error loading restaurants: {error.message}</p>
      </div>
    );
  }

  if (filteredRestaurants.length === 0) {
    return (
      <div
        style={{
          textAlign: "left", // Left-align the message
          marginTop: "20px",
          color: "white",
          fontFamily: "'Nunito', sans-serif", // Use Nunito font
          fontSize: "20px", // Bigger font size for readability
          fontWeight: "500", // Medium-weight font
        }}
      >
        <p>No restaurants found matching your search.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid", // Use CSS Grid for layout
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Force items to align left
        gap: "10px", // Space between cards
        maxWidth: "1000px", // Limit maximum width for grid
        margin: "0 auto", // Center grid container
        paddingRight: "10px", // Ensure alignment with other elements
        overflow: "visible", // Ensure shadows are visible
      }}
    >
      {filteredRestaurants.map((res, index) => (
        <motion.div
          key={res.UID_Restaurant}
          initial="hidden"
          animate="visible"
          variants={restaurantCardVariants} // Apply cascading animation
          transition={{
            delay: index * CASCADE_DELAY, // Staggered cascading effect
            duration: CARD_ANIMATION_DURATION, // Animation duration for each card
            ease: CARD_ANIMATION_EASING, // Configurable easing style
          }}
        >
          <RestaurantCard
            restaurant={res}
            isSelected={restaurantID === res.UID_Restaurant}
            onSelect={handleButtonClick}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Restaurants;
