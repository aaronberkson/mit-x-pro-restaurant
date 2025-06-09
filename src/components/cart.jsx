import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Badge } from "react-bootstrap";
import { CartContext } from "../components/context";
import { BiCart, BiPlusCircle, BiMinusCircle, BiTrash } from "react-icons/bi";
import { motion } from "framer-motion";

// Animation constants
const ITEM_BOUNCE_DURATION = 0.8; // Slightly quicker bounce for items
const STAGGER_DELAY = 0.15; // Delay between item animations
const NUMBER_FLIP_DURATION = 0.2; // Fast animations for badges and numbers
const NUMBER_FLIP_EASING = "easeOut";

// Animation variants
const cardAnimationVariants = {
  hidden: { opacity: 0, y: -50 }, // Start above the viewport
  visible: (custom) => ({
    opacity: 1, // Set opacity directly to 1 (no transitions during bounce)
    y: [-50, 0], // Smooth downward motion with bounce
    transition: {
      type: "spring",
      stiffness: 180, // Controls speed: higher stiffness = faster animation
      damping: 14,    // Controls bounce: lower damping = more bounce
      mass: 1,        // Controls "weight": higher = heavier/slower with more bounce, lower = lighter/faster with less bounce. Accepts any positive floating-point value.
      delay: custom, // Dynamic delay for staggered effects
    },
  }),
};

const itemBounceVariants = {
  hidden: { opacity: 0, y: -30 }, // Start slightly above
  visible: (i) => ({
    opacity: 1,
    y: 0, // Settle at its normal position
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 14,
      duration: ITEM_BOUNCE_DURATION,
      delay: STAGGER_DELAY * i, // Stagger animation based on index
    },
  }),
};

const cartBadgeFlipVariants = {
  hidden: {
    rotateY: -90,
    scale: 0.85,
    perspective: 600,
  },
  visible: {
    rotateY: 0,
    scale: 1,
    perspective: 600,
    transition: {
      duration: NUMBER_FLIP_DURATION,
      ease: NUMBER_FLIP_EASING,
    },
  },
};

const badgeFlipVariants = {
  hidden: {
    rotateX: -90,
    scale: 0.85,
    perspective: 600,
  },
  visible: {
    rotateX: 0,
    scale: 1,
    perspective: 600,
    transition: {
      duration: NUMBER_FLIP_DURATION,
      ease: NUMBER_FLIP_EASING,
    },
  },
};

const numberFlipVariants = {
  hidden: {
    opacity: 0,
    rotateX: -90,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
    transition: {
      duration: NUMBER_FLIP_DURATION,
      ease: NUMBER_FLIP_EASING,
    },
  },
};
function Cart({ headerAnimationDelay }) {
  const { cart, addItem, removeItem, setCart } = useContext(CartContext);

  if (!cart) {
    console.error("CartContext is undefined or cart is missing. Ensure AppProvider wraps this component.");
    return null;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [pressedIcon, setPressedIcon] = useState(null);

  useEffect(() => {
    setHoveredIcon(null);
    setPressedIcon(null);
  }, []);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleMouseEnter = (iconId) => setHoveredIcon(iconId);
  const handleMouseLeave = () => setHoveredIcon(null);
  const handleMouseDown = (iconId) => setPressedIcon(iconId);
  const handleMouseUp = () => setPressedIcon(null);

  const iconStyle = (iconId) => ({
    color: pressedIcon === iconId ? "#fbbd08" : hoveredIcon === iconId ? "#f8e71c" : "white",
    transform: pressedIcon === iconId ? "scale(1.3)" : hoveredIcon === iconId ? "scale(1.15)" : "scale(1)",
    transition: "color 0.2s, transform 0.2s",
  });

  const renderHeader = () => {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "12px 15px",
          backgroundColor: "#002322",
          color: "white",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", marginRight: "10px", height: "40px", width: "40px" }}>
          <BiCart size={40} />
          {totalItems > 0 && (
            <motion.div
              key={totalItems}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cartBadgeFlipVariants}
              style={{
                position: "absolute",
                top: "0px",
                right: "-10px",
                height: "30px",
                width: "30px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 123, 255, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                key={totalItems}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {totalItems}
              </motion.div>
            </motion.div>
          )}
        </div>
        <span style={{ fontSize: "21px", fontWeight: "bold", color: "white", marginLeft: "10px" }}>
          Shopping Cart
        </span>
      </motion.div>
    );
  };
  const renderItems = () => {
    const isCheckoutPage = location.pathname === "/checkout";

    if (!cart || !cart.items || cart.items.length === 0) {
      return null;
    }

    return cart.items
      .filter((item) => item.quantity > 0)
      .map((item, index) => (
        <motion.div
          key={item.UID_Dish}
          initial="hidden"
          animate="visible"
          exit="hidden"
          custom={index} // Pass the index for staggered animations
          variants={itemBounceVariants}
          style={{ marginBottom: "10px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <motion.div
              key={item.quantity}
              initial="hidden"
              animate="visible"
              variants={badgeFlipVariants}
              style={{
                marginRight: "8px",
              }}
            >
              <Badge
                bg="primary"
                style={{
                  fontSize: "14px",
                  borderRadius: "50%",
                  height: "30px",
                  width: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  key={item.quantity}
                  initial="hidden"
                  animate="visible"
                  variants={numberFlipVariants}
                >
                  {item.quantity}
                </motion.div>
              </Badge>
            </motion.div>
            <span
              id="item-name"
              style={{ flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {item.Name}
            </span>
            <span id="item-price" style={{ minWidth: "70px", textAlign: "right" }}>
              <motion.div
                key={item.Price * item.quantity}
                initial="hidden"
                animate="visible"
                variants={numberFlipVariants}
              >
                ${item.Price ? (item.Price * item.quantity).toFixed(2) : "0.00"}
              </motion.div>
            </span>
          </div>
          {!isCheckoutPage && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "5px",
                gap: "8px",
              }}
            >
              <Button
                onMouseEnter={() => handleMouseEnter(`plus-${item.UID_Dish}`)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => handleMouseDown(`plus-${item.UID_Dish}`)}
                onMouseUp={handleMouseUp}
                onClick={() => addItem(item)}
                variant="link"
                style={{ padding: 0, border: "none" }}
              >
                <BiPlusCircle size={16} style={iconStyle(`plus-${item.UID_Dish}`)} />
              </Button>
              <Button
                onMouseEnter={() => handleMouseEnter(`minus-${item.UID_Dish}`)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => handleMouseDown(`minus-${item.UID_Dish}`)}
                onMouseUp={handleMouseUp}
                onClick={() => removeItem(item)}
                variant="link"
                style={{ padding: 0, border: "none" }}
              >
                <BiMinusCircle size={16} style={iconStyle(`minus-${item.UID_Dish}`)} />
              </Button>
              <Button
                onMouseEnter={() => handleMouseEnter(`trash-${item.UID_Dish}`)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => handleMouseDown(`trash-${item.UID_Dish}`)}
                onMouseUp={handleMouseUp}
                onClick={() => {
                  const updatedItems = cart.items.map((i) =>
                    i.UID_Dish === item.UID_Dish ? { ...i, quantity: 0 } : i
                  );
                  const newTotal = updatedItems.reduce(
                    (acc, i) => acc + i.Price * i.quantity,
                    0
                  );
                  setCart({ ...cart, items: updatedItems, total: newTotal });
                }}
                variant="link"
                style={{ padding: 0, border: "none" }}
              >
                <BiTrash size={16} style={iconStyle(`trash-${item.UID_Dish}`)} />
              </Button>
            </div>
          )}
        </motion.div>
      ));
  };
  const checkoutItems = () => {
    const isCheckoutPage = location.pathname === "/checkout";
    const isCartEmpty = !cart.items || cart.items.length === 0;

    const handleOrderClick = () => {
      if (!isCartEmpty) {
        navigate("/checkout");
      }
    };

    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);

    const buttonStyle = {
      width: "150px",
      backgroundColor: active ? "#1f7a2d" : hover ? "#218838" : "#28a745",
      borderColor: active ? "#1a5f28" : hover ? "#1e7e34" : "#28a745",
      color: "white",
      marginTop: "10px",
      fontWeight: "bold",
      fontSize: "17px",
      cursor: "pointer",
      boxShadow: active ? "inset 0 3px 5px rgba(0, 0, 0, 0.125)" : "none",
      transition: "background-color 0.2s, border-color 0.2s, box-shadow 0.2s",
    };

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          paddingTop: "2px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#343a40",
          }}
        >
          <h3 style={{ fontWeight: "600", fontSize: "20px", color: "lightgray", margin: 0 }}>
            Total
          </h3>
          <h3 style={{ margin: 0, fontWeight: "600", fontSize: "20px", color: "white" }}>
            <motion.div
              key={cart.total}
              initial="hidden"
              animate="visible"
              variants={numberFlipVariants}
            >
              ${cart.total ? cart.total.toFixed(2) : "0.00"}
            </motion.div>
          </h3>
        </div>
        {!isCheckoutPage && (
          <Button
  style={{
    width: "150px",
    backgroundColor: active ? "#1f7a2d" : hover ? "#218838" : "#28a745",
    borderColor: active ? "#1a5f28" : hover ? "#1e7e34" : "#28a745",
    color: "white",
    marginTop: "10px",
    fontWeight: "bold",
    fontSize: "17px",
    cursor: "pointer",
    boxShadow: active ? "inset 0 3px 5px rgba(0, 0, 0, 0.125)" : "none",
    transition: "background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.1s ease", // Added transform transition
    transform: active ? "scale(0.98)" : "scale(1)", // Shrink effect on active
  }}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  onMouseDown={() => setActive(true)}
  onMouseUp={() => setActive(false)}
  onClick={handleOrderClick}
  disabled={isCartEmpty}
>
  Order
</Button>

        )}
      </motion.div>
    );
  };
  
  const handleHeightChange = (newHeight) => {
    setCartHeight(newHeight); // Dynamically update height
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={headerAnimationDelay} // Pass animation delay dynamically
      variants={cardAnimationVariants} // Elastic spring applied to top-level card
      layout // Automatically animates height changes
      transition={{
        type: "spring", // Smooth spring-based bounce
        stiffness: 180, // Controls speed: higher = faster animation
        damping: 12,    // Controls bounce: lower = more springy motion
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "0px",
        overflow: "hidden", // Prevent clipping during transitions
      }}
    >
      <Card
        style={{
          paddingTop: "12px",
          paddingLeft: "5px",
          paddingRight: "5px",
          paddingBottom: "5px",
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#002322",
          color: "white",
          borderRadius: "10px",
          boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.5)",
        }}
      >
        {renderHeader()}
        <Card.Body
          as={motion.div}
          initial="hidden"
          animate="visible"
          layout // Add layout here to animate internal content changes
          transition={{
            type: "spring",
            stiffness: 180, // Match the bounce effect to the outer container
            damping: 12,
          }}
          style={{ padding: "6px 12px" }}
        >
          {renderItems()} {/* Staggered bounce animations applied here */}
          {checkoutItems()} {/* Checkout section remains intact */}
        </Card.Body>
      </Card>
    </motion.div>
  );
  
}
export default Cart;
