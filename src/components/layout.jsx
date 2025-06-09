import React, { useCallback, memo, useState } from "react";
import { Container, Navbar, Button, InputGroup, FormControl } from "react-bootstrap";
import { motion } from "framer-motion"; // Import Framer Motion
import { useSearchContext } from "./searchContext"; // Use the SearchProvider context
import TrainSmoke from "../effects/trainSmoke"; // Import PixiJS smoke component
import { FaSearch } from "react-icons/fa"; // Import the magnifying glass icon

// Animation constants
const ANIMATION_DURATION = 0.75; // Duration for logo animation
const LOGO_DELAY = 0.7; // Timing for logo animation resolution
const SEARCH_DURATION = 0.3; // Fast wipe duration for search box
const STRIPE_DURATION = 0.2; // Quick Powered by Stripe wipe
const STRIPE_DELAY = .7; // Independent delay for the Stripe logo wipe
const STAGGER_DURATION = 0.1; // Timing between staggered elements

// Variants for staggered animation
const parentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DURATION, // Controls time between child animations
    },
  },
};

const fadeWipeVariants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" }, // Start fully hidden with fade
  visible: { opacity: 1, clipPath: "inset(0 0% 0 0)" }, // Fade in and wipe left-to-right
};

const Layout = memo(({ children }) => {
  const { setSearchQuery } = useSearchContext(); // Access SearchContext
  const [localSearchInput, setLocalSearchInput] = useState(""); // Temporary local state for input

  // Update the input value locally
  const handleInputChange = useCallback(
    (e) => {
      const query = e.target.value.toLowerCase();
      setLocalSearchInput(query); // Update local input state
      console.log("[GT][Layout][SearchContext] Local input updated to:", query); // Debug log
    },
    []
  );

  // Trigger search on submit
  const handleSearchSubmit = useCallback(() => {
    console.log("[GT][Layout][SearchContext] Submit button clicked. Search query updated to:", localSearchInput);
    setSearchQuery(localSearchInput); // Update context with input value
  }, [localSearchInput, setSearchQuery]);

  return (
    <div
      style={{
        backgroundColor: "#0f1126",
        minHeight: "100vh",
        background: "url('/path-to-your-background-image.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
      }}
    >
      <header>
        <Navbar bg="dark" variant="dark" style={{ width: "100%" }}>
          <motion.div
            initial="hidden" // Initial state for all children
            animate="visible" // Final state for all children
            variants={parentVariants} // Apply staggered animation to parent container
            style={{
              maxWidth: "1200px",
              width: "100%",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 33px",
              position: "relative", // Ensures child elements align properly
            }}
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, x: -100 }} // Start hidden and offset
              animate={{ opacity: 1, x: 0 }} // Fade and slide to final position
              transition={{
                duration: ANIMATION_DURATION,
                ease: "easeInOut",
              }}
              style={{ position: "relative", overflow: "hidden" }} // Add overflow:hidden to avoid duplication
            >
              <Navbar.Brand href="/" style={{ marginRight: "2px" }}>
                <img
                  src="/images/gravytrain-logo-no-smoke.svg"
                  alt="GravyTrain Logo"
                  style={{
                    height: "88px",
                    padding: 0,
                    margin: 0,
                  }}
                />
              </Navbar.Brand>

              {/* Smoke Animation */}
              <TrainSmoke />
            </motion.div>
            {/* Search Box Animation */}
            <motion.div
              variants={fadeWipeVariants} // Combine fade-in and wipe effects
              transition={{
                delay: LOGO_DELAY - 0.25, // Starts earlier for more overlap with logo animation
                duration: SEARCH_DURATION, // Quick wipe duration
                ease: "easeInOut", // Smooth easing for transitions
              }}
              style={{
                flex: 1,
                maxWidth: "680px",
                display: "flex",
                alignItems: "center",
                marginLeft: "20px",
                marginRight: "78px",
                overflow: "hidden", // Ensures masking effect
              }}
            >
              <InputGroup style={{ width: "100%", height: "40px" }}>
                <FormControl
                  placeholder="Search"
                  value={localSearchInput} // Bind input value to local state
                  onChange={handleInputChange} // Update local state via handler
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("[GT][Layout][SearchContext] Enter key pressed."); // Debug: Enter key
                      handleSearchSubmit();
                    }
                  }}
                  style={{
                    backgroundColor: "#B0BEC5",
                    color: "#1a1a1a",
                    border: "none",
                    height: "100%",
                    padding: "10px",
                  }}
                />
                <Button
                  onClick={handleSearchSubmit} // Handle search submission
                  style={{
                    backgroundColor: "#FF8C00", // Goldenrod
                    border: "none",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                  }}
                >
                  <FaSearch size={20} style={{ color: "currentColor" }} /> {/* Use React Icons */}
                </Button>
              </InputGroup>
            </motion.div>

            {/* Powered by Stripe Animation */}
            <motion.div
              variants={fadeWipeVariants} // Combine fade-in and wipe effects
              transition={{
                delay: STRIPE_DELAY, // Relies on the independent STRIPE_DELAY constant
                duration: STRIPE_DURATION, // Quick wipe and fade duration
                ease: "easeInOut", // Smooth easing
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden", // Ensures masking effect
              }}
            >
              <img
                src="/images/powered_by_stripe-white.svg"
                alt="Powered by Stripe"
                style={{
                  marginLeft: "0px",
                  marginRight: "45px",
                  height: "40px",
                }}
              />
            </motion.div>
          </motion.div>
        </Navbar>
      </header>
      <Container
        style={{
          maxWidth: "1200px",
          padding: "0", // No extra padding
          margin: "0 auto", // Center container itself while not affecting child alignment
          textAlign: "left", // Ensure left-alignment for child elements
          overflow: "visible", // Ensure shadows are visible
        }}
      >
        {children}
      </Container>
    </div>
  );
});

export default Layout;
