import React from "react";
import { motion } from "framer-motion";

// Constants for the overall component size
const COMPONENT_WIDTH = 395; // Current overall width of the component
const COMPONENT_HEIGHT = 90; // Current overall height of the component

// Constants for toast animation parameters
const TOAST_DISTANCE = 75; // Distance it travels upwards
const TOAST_STIFFNESS = 80; // Subtle bounce effect (lower stiffness)
const TOAST_DAMPING = 15; // Higher damping for more controlled bounce
const TOAST_DURATION = 0.6; // Duration of the animation
const TOAST_DELAY = 0; // Delay for toast animation

// Constants for customization
const GREEN_FILL_COLOR = "#007A5C";
const GLOW_COLOR = "#00d99a"; // Teal-green color from the Stripe palette

const CARD_WIDTH = 156;
const CARD_HEIGHT = 78;
const CARD_X = 251.5;
const CARD_Y = 4;

const SHIELD_WIDTH = 24;
const SHIELD_HEIGHT = 24;
const SHIELD_X = 366;
const SHIELD_Y = 60;

const TEXT_X = 27;
const TEXT_Y = 20;
const TEXT_FONT_SIZE = "17px";
const TEXT_FONT_WEIGHT = "600";
const TEXT_COLOR = "white";

// Animation delays as constants
const CARD_TWIRL_DELAY = 0.3; // Slight delay before animation starts
const TEXT_WIPE_DELAY = 0.2; // Delay for text wipe animation
const SHIELD_DELAY = 0.4; // Delay for shield animation

// Constants for the text wipe timing
const TEXT_WIPE_DURATION = 0.7; // Controls how long the wipe effect takes
const TEXT_WIPE_EASE = "easeInOut"; // Dynamic motion curve for the wipe

// Credit card animation parameters
const CARD_TWIRL_SCALE_INITIAL = 0; // Initial scale
const CARD_TWIRL_ROTATE_INITIAL = -180; // Initial rotation (degrees)
const CARD_TWIRL_OPACITY_INITIAL = 0; // Initial opacity
const CARD_TWIRL_SCALE_FINAL = 1; // Final scale
const CARD_TWIRL_ROTATE_FINAL = 0; // Final rotation (degrees)
const CARD_TWIRL_OPACITY_FINAL = 1; // Final opacity
const CARD_TWIRL_DURATION = 0.4; // Shorter overall duration for quicker motion
const CARD_TWIRL_CURVE = [0.25, 0.1, 0.25, 1]; // Custom cubic-bezier for slow start & faster finish

// Refined Shield Animation Parameters
const SHIELD_SCALE_INITIAL = 0.5; // Start at 50%
const SHIELD_SCALE_FINAL = 1.0; // Expand to 100%
const SHIELD_BOUNCE_SCALE = 1.2; // Pulse peak scale (120%)
const SHIELD_INITIAL_DURATION = 1; // Slightly longer fade-in duration
const SHIELD_BOUNCE_DURATION = 0.35; // Maintain snappy pulse duration
const SHIELD_CURVE = "easeInOut"; // Elastic easing for dynamic bounce

// Constants for glow animation
const GLOW_SPEED = 3; // Animation duration (in seconds)
const GLOW_EASING = "linear"; // Customize the curve (e.g., "linear", "ease-in-out", etc.)
const BORDER_WIDTH = 3; // Border thickness
const BORDER_RADIUS = 11; // Matches the rounded corners of the border

const CheckoutFormSuccess = () => {
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
        type: "spring", // Spring animation for subtle bounce
        stiffness: TOAST_STIFFNESS, // Controls the bounce intensity
        damping: TOAST_DAMPING, // Smoothens the bounce
        duration: TOAST_DURATION, // Duration of the entire animation
        delay: TOAST_DELAY, // Delay for toast animation
      }}
      style={{
        position: "relative",
        marginTop: "15px",
        padding: "20px",
        borderRadius: `${BORDER_RADIUS}px`, // Desired corner radius
        backgroundColor: GREEN_FILL_COLOR, // Inner fill color
        overflow: "hidden", // Keep content contained within the radius
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: `${COMPONENT_WIDTH}px`, // Apply the new constant
        height: `${COMPONENT_HEIGHT}px`, // Apply the new constant
      }}
    >
      {/* Jade Green Fill Mask */}
      <div
        style={{
          position: "absolute",
          inset: `${BORDER_WIDTH}px`, // Slightly inset to respect the border thickness
          backgroundColor: GREEN_FILL_COLOR, // Jade green fill
          zIndex: 3, // Above the glow but behind the border
          borderRadius: "inherit", // Ensure it matches the border's round corners
        }}
      ></div>

      {/* Static Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit", // Match the container's corner radius
          padding: `${BORDER_WIDTH}px`, // Space for the border
          background: `linear-gradient(90deg, #6CA6CD, #0000ff, #663399, #4b0082)`, // Gradient: slightly darker light blue on the left
          WebkitMask: "linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)", // Mask the inner content
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none", // Prevent interaction issues
          zIndex: 1, // Below the jade green fill
        }}
      ></div>
      {/* Bright Glow Rotating Along Border */}
      <div
        style={{
          position: "absolute",
          inset: `${BORDER_WIDTH}px`, // Align the glow with the border thickness
          borderRadius: "inherit", // Match the container's round corners
          animation: `rotateGlow ${GLOW_SPEED}s ${GLOW_EASING} infinite`, // Dynamically set speed and curve
          zIndex: 2, // Above the gradient border but below jade green fill
        }}
      >
        <div
          style={{
            position: "absolute",
            width: `${BORDER_WIDTH * 2}px`, // Glow diameter matches border thickness
            height: `${BORDER_WIDTH * 2}px`,
            borderRadius: "50%", // Circular shape
            backgroundColor: GLOW_COLOR, // Bright green color using constant
            boxShadow: `0 0 30px 30px ${GLOW_COLOR}`, // Diffuse glow effect using constant
            transform: "translate(-50%, -50%)", // Center the glow on its path
          }}
        ></div>
      </div>

      <style>
        {`
          @keyframes rotateGlow {
            0% {
              transform: translate(50%, 0%); /* Start at top center */
            }
            12.5% {
              transform: translate(87.5%, 12.5%); /* Top-right curve */
            }
            25% {
              transform: translate(100%, 50%); /* Middle of right side */
            }
            37.5% {
              transform: translate(87.5%, 87.5%); /* Bottom-right curve */
            }
            50% {
              transform: translate(50%, 100%); /* Middle of bottom side */
            }
            62.5% {
              transform: translate(12.5%, 87.5%); /* Bottom-left curve */
            }
            75% {
              transform: translate(0%, 50%); /* Middle of left side */
            }
            87.5% {
              transform: translate(12.5%, 12.5%); /* Top-left curve */
            }
            100% {
              transform: translate(50%, 0%); /* Return to top center */
            }
          }
        `}
      </style>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          zIndex: 4, // Above the jade green fill
          left: `${TEXT_X}px`, // Horizontal placement based on constants
          top: `${TEXT_Y}px`, // Vertical placement based on constants
          overflow: "hidden", // Clip the wiping effect
          maxWidth: "220px", // Limit the width for proper wrapping
          height: "auto", // Adjust height dynamically based on content
        }}
      >
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }} // Start with mask covering entire text
          animate={{ clipPath: "inset(0 0 0 0)" }} // Reveal text by reducing mask
          transition={{
            duration: TEXT_WIPE_DURATION, // Controls wipe timing
            delay: TEXT_WIPE_DELAY, // Control text wipe animation start
            ease: TEXT_WIPE_EASE, // Dynamic motion for the wipe
          }}
          style={{
            fontSize: TEXT_FONT_SIZE,
            fontWeight: TEXT_FONT_WEIGHT,
            color: TEXT_COLOR,
            whiteSpace: "normal", // Maintain wrapping within maxWidth constraints
          }}
        >
          Stripe API mock payment authorized successfully!
        </motion.div>
      </div>

      {/* Credit Card */}
      <motion.div
        initial={{
          scale: CARD_TWIRL_SCALE_INITIAL,
          rotate: CARD_TWIRL_ROTATE_INITIAL,
          opacity: CARD_TWIRL_OPACITY_INITIAL,
        }}
        animate={{
          scale: CARD_TWIRL_SCALE_FINAL,
          rotate: CARD_TWIRL_ROTATE_FINAL,
          opacity: CARD_TWIRL_OPACITY_FINAL,
        }}
        transition={{
          duration: CARD_TWIRL_DURATION,
          delay: CARD_TWIRL_DELAY, // Adjusted delay
          ease: CARD_TWIRL_CURVE, // Slower start and faster finish
        }}
        style={{
          position: "absolute",
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          left: `${CARD_X}px`,
          top: `${CARD_Y}px`, // Use CARD_Y for dynamic vertical positioning
          padding: "0", // Remove padding in the image container
          margin: "0", // Remove margins
          objectFit: "cover", // Adjust image fitting
          borderRadius: "10px",
          zIndex: 5,
        }}
      >
        <img
          src="/images/credit-card-w-stripe-logo.svg"
          alt="Credit Card"
          style={{
            width: "100%",
            height: "100%",
            display: "block", // Remove inline spacing or misalignment
            objectFit: "cover", // Ensure the image fills the dimensions properly
          }}
        />
      </motion.div>

      {/* Shield Badge */}
      <motion.div
  initial={{
    opacity: 0, // Fully transparent
  }}
  animate={{
    opacity: 1, // Fade in to fully visible
  }}
  transition={{
    duration: 0.6, // Duration for fade-in effect
    delay: 0.4, // Delay before fade-in starts
  }}
  style={{
    position: "absolute",
    width: `${SHIELD_WIDTH}px`,
    height: `${SHIELD_HEIGHT}px`,
    left: `${SHIELD_X}px`,
    top: `${SHIELD_Y}px`,
    zIndex: 6,
  }}
>
  <motion.img
    initial={{
      scale: SHIELD_SCALE_INITIAL, // Start at 50%
    }}
    animate={{
      scale: [SHIELD_SCALE_FINAL, SHIELD_BOUNCE_SCALE, SHIELD_SCALE_FINAL], // 100% → 120% → 100%
    }}
    transition={{
      duration: SHIELD_INITIAL_DURATION + SHIELD_BOUNCE_DURATION,
      ease: SHIELD_CURVE, // Use a valid curve or spring
    }}
    style={{
      width: "100%",
      height: "100%",
    }}
    src="/images/shield-green-w-check-stripecolors.svg"
    alt="Shield Badge"
  />
</motion.div>



      
    </motion.div>
  );
};

export default CheckoutFormSuccess;
