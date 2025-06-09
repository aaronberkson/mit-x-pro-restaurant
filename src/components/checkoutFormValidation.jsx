import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Positioning Constants
const CHEVRON_X_OFFSET = -65; // Horizontal offset for the chevron
const TOOLTIP_BUBBLE_X_OFFSET = -1; // Horizontal offset for the bubble
const FULL_TOOLTIP_Y_OFFSET = -60; // Vertical offset for the tooltip

export const CardTooltip = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleFocus = () => {
    setIsVisible(true); // Show tooltip on focus (via mouse or keyboard)
  };

  const handleBlur = () => {
    setIsVisible(false); // Hide tooltip on blur (via mouse or keyboard)
  };

  const handleMouseEnter = () => {
    setIsVisible(true); // Show tooltip on hover
  };

  const handleMouseLeave = () => {
    setIsVisible(false); // Hide tooltip on mouse leave
  };

  return (
    <div
      style={{
        position: "relative", // Anchor the tooltip relative to this wrapper
        display: "flex", // Use flexbox to ensure alignment
        alignItems: "center", // Vertically align the input field with its label
        gap: "10px", // Optional: Add consistent spacing between elements in the row
      }}
    >
      {/* Credit Card Input Field or Child Elements */}
      <div
        tabIndex="0" // Make the element focusable with the keyboard
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "inline-block", // Ensure the input field doesn't break the row layout
        }}
      >
        {children}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} // Start below with 0 opacity
            animate={{ opacity: 1, y: 0 }} // Move to its final position
            exit={{ opacity: 0, y: 10 }} // Move down and fade out on exit
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 20,
            }}
            style={{
              position: "absolute",
              left: `${TOOLTIP_BUBBLE_X_OFFSET}px`, // Horizontal offset for the tooltip
              top: `${FULL_TOOLTIP_Y_OFFSET}px`, // Vertical offset above the input
              backgroundColor: "#9B30FF", // Purple tooltip bubble
              color: "white", // White text for readability
              borderRadius: "10px", // Rounded corners
              padding: "4px 10px 1px 10px", // Compact padding
              fontFamily: "Nunito Sans, sans-serif", // Consistent font
              fontSize: "0.9em", // Comfortable text size
              textAlign: "left", // Left-align text
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)", // Drop shadow for a floating effect
              whiteSpace: "nowrap", // Prevent text wrapping
              zIndex: "1000", // Keep it above other elements
            }}
          >
            {/* Tooltip Content */}
            Use # <strong>4242 4242 4242 4242</strong> to test the 
              <img 
                src="/images/stripe_wordmark-white.svg" 
                alt="Stripe logo" 
                style={{
                  display: "inline-block", // Ensures the logo aligns inline with text
                  width: "57px", // Adjust the width for appropriate scaling
                  verticalAlign: "middle", // Vertically center the logo with the text
                  padding: "0px",
                  marginTop: "0px",
                  marginBottom: "1px",
                }}
              />
            server.
            {/* Chevron / Arrow */}
            <div
              style={{
                position: "absolute",
                top: "100%", // Position chevron below the bubble
                left: `calc(50% + ${CHEVRON_X_OFFSET}px)`, // Adjust chevron position
                width: "0",
                height: "0",
                borderLeft: "6px solid transparent", // Transparent sides
                borderRight: "6px solid transparent", // Transparent sides
                borderTop: "10px solid #9B30FF", // Purple chevron matches bubble
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
