import React from "react";
import { motion } from "framer-motion";

// Constants for the overall component size
const COMPONENT_WIDTH = 395; // Same width for consistency
const COMPONENT_HEIGHT = 45; // Compact height for non-wrapped text

// Constants for toast animation parameters
const TOAST_DISTANCE = 75; // Distance it travels upwards
const TOAST_STIFFNESS = 80; // Subtle bounce effect
const TOAST_DAMPING = 15; // Controlled bounce
const TOAST_DURATION = 0.6; // Animation duration
const TOAST_DELAY = 0; // Delay for toast animation

// Error-specific customization
const RED_FILL_COLOR = "#C8251D"; // Deep, rich red for the background
const BRIGHT_GLOW_COLOR = "#FFFFFF"; // Bright white glow for contrast

// Distinct border gradient using varied red-orange tones
const BORDER_GRADIENT = `linear-gradient(90deg, #FF9F80, #FF6F61, #E07A5F)`;

// Constants for text styling
const TEXT_X = 21;
const TEXT_Y = 10; // Adjusted for reduced height
const TEXT_FONT_SIZE = "17px";
const TEXT_FONT_WEIGHT = "600";
const TEXT_COLOR = "white"; // White text for contrast
const TEXT_MAX_WIDTH = "380px"; // Updated max width for text

// Animation delays as constants
const TEXT_WIPE_DURATION = 0.7;
const TEXT_WIPE_DELAY = 0.2;
const TEXT_WIPE_EASE = "easeInOut";

const BORDER_WIDTH = 3;
const BORDER_RADIUS = 11; // Matches rounded corners of the border

const CheckoutFormError = ({ error }) => {
  return (
    <motion.div
      initial={{
        y: TOAST_DISTANCE, // Start below
        opacity: 0, // Start transparent
      }}
      animate={{
        y: 0, // Settle into final position
        opacity: 1, // Fade in
      }}
      transition={{
        type: "spring", // Subtle bounce
        stiffness: TOAST_STIFFNESS, 
        damping: TOAST_DAMPING, 
        duration: TOAST_DURATION, 
        delay: TOAST_DELAY,
      }}
      style={{
        position: "relative",
        marginTop: "15px",
        padding: "20px",
        borderRadius: `${BORDER_RADIUS}px`,
        backgroundColor: RED_FILL_COLOR,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: `${COMPONENT_WIDTH}px`,
        height: `${COMPONENT_HEIGHT}px`, // Reduced height for compact design
      }}
    >
      {/* Deep Red Fill */}
      <div
        style={{
          position: "absolute",
          inset: `${BORDER_WIDTH}px`,
          backgroundColor: RED_FILL_COLOR,
          zIndex: 3,
          borderRadius: "inherit",
        }}
      ></div>

      {/* Multi-Shade Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: `${BORDER_WIDTH}px`,
          background: BORDER_GRADIENT, // Warm color gradient
          WebkitMask: "linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 1,
        }}
      ></div>

      {/* Bright White Glow Rotating Along Border */}
      <div
        style={{
          position: "absolute",
          inset: `${BORDER_WIDTH}px`,
          borderRadius: "inherit",
          animation: `rotateGlow 6s linear infinite`, // Adjusted speed for smooth traversal
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: `${BORDER_WIDTH * 2}px`,
            height: `${BORDER_WIDTH * 2}px`,
            borderRadius: "50%",
            backgroundColor: BRIGHT_GLOW_COLOR, 
            boxShadow: `0 0 30px 30px ${BRIGHT_GLOW_COLOR}`, 
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      </div>

      <style>
        {`
          @keyframes rotateGlow {
            0% {
              transform: translate(50%, 0%);
            }
            25% {
              transform: translate(100%, 50%);
            }
            50% {
              transform: translate(50%, 100%);
            }
            75% {
              transform: translate(0%, 50%);
            }
            100% {
              transform: translate(50%, 0%);
            }
          }
        `}
      </style>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          zIndex: 4,
          left: `${TEXT_X}px`,
          top: `${TEXT_Y}px`,
          overflow: "hidden",
          maxWidth: TEXT_MAX_WIDTH, // Adjusted max width
          height: "auto",
        }}
      >
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{
            duration: TEXT_WIPE_DURATION,
            delay: TEXT_WIPE_DELAY,
            ease: TEXT_WIPE_EASE,
          }}
          style={{
            fontSize: TEXT_FONT_SIZE,
            fontWeight: TEXT_FONT_WEIGHT,
            color: TEXT_COLOR,
            whiteSpace: "normal",
          }}
        >
          {error}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutFormError;
