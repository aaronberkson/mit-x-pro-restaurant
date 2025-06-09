import React from "react";
import { motion } from "framer-motion";

// Define a constant for the delay duration
const ANIMATION_DELAY = 0.15; // Delay in seconds

const CheckoutFormAnimation = ({ children }) => {
  const animationVariants = {
    hidden: { opacity: 0, y: -50 }, // Start above with full transparency
    visible: {
      opacity: 1, // Fade in
      y: 0, // Smooth downward motion
      transition: {
        delay: ANIMATION_DELAY, // Apply delay here
        type: "spring",
        stiffness: 180, // Controls the speed
        damping: 12,    // Controls the bounce
        duration: 0.8,  // Total animation duration
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants}
      style={{
        display: "inline-block", // Shrink-wrap the contents
      }}
    >
      {children}
    </motion.div>
  );
};

export default CheckoutFormAnimation;
