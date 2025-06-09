import React, { useState, useCallback, createContext, useMemo, useContext } from "react";

// Cart Context
export const CartContext = createContext({
  cart: { items: [], total: 0 },
  addItem: () => {},
  removeItem: () => {},
  setCart: () => {},
});

// User Context
export const UserContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

// Hover State Context
export const HoverStateContext = createContext({
  hoverStates: {},
  setHoverStates: () => {},
});

// Hook for Hover States
export const useHoverStates = () => useContext(HoverStateContext);

// Active State Context
export const ActiveStateContext = createContext({
  activeStates: {},
  setActiveStates: () => {},
});

// Hook for Active States
export const useActiveStates = () => useContext(ActiveStateContext);

// Restaurant Selection Context
export const RestaurantSelectionContext = createContext({
  restaurantID: null,
  setRestaurantID: () => {},
});

// Hook for Restaurant Selection
export const useRestaurantSelection = () =>
  useContext(RestaurantSelectionContext);

// App Provider to wrap entire application
export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [hoverStates, setHoverStates] = useState({});
  const [activeStates, setActiveStates] = useState({});
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;
  const [restaurantID, setRestaurantID] = useState(null);

  // Add item to cart
  const addItem = useCallback(
    (item) => {
      if (!item.Price) {
        console.error("[GT][context.js] Missing item price:", item);
        return;
      }
      const updatedItems = [...cart.items];
      const existingItemIndex = updatedItems.findIndex((i) => i.UID_Dish === item.UID_Dish);

      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems.push({ ...item, quantity: 1 });
      }

      updateCart(updatedItems);
    },
    [cart.items]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (item) => {
      const updatedItems = cart.items
        .map((i) => {
          if (i.UID_Dish === item.UID_Dish && i.quantity > 0) {
            return { ...i, quantity: i.quantity - 1 };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);

      updateCart(updatedItems);
    },
    [cart.items]
  );

  // Update cart total
  const updateCart = useCallback((updatedItems) => {
    const newTotal = updatedItems.reduce(
      (acc, i) => acc + (i.Price || 0) * i.quantity,
      0
    );
    setCart({ items: updatedItems, total: newTotal });
  }, []);

  // Memoized context values for optimized performance
  const cartValue = useMemo(
    () => ({
      cart,
      addItem,
      removeItem,
      setCart,
    }),
    [cart, addItem, removeItem]
  );

  const hoverStateValue = useMemo(
    () => ({
      hoverStates,
      setHoverStates,
    }),
    [hoverStates]
  );

  const activeStateValue = useMemo(
    () => ({
      activeStates,
      setActiveStates,
    }),
    [activeStates]
  );

  const userValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
    }),
    [user, isAuthenticated]
  );

  const restaurantSelectionValue = useMemo(
    () => ({
      restaurantID,
      setRestaurantID,
    }),
    [restaurantID]
  );

  return (
    <CartContext.Provider value={cartValue}>
      <UserContext.Provider value={userValue}>
        <HoverStateContext.Provider value={hoverStateValue}>
          <ActiveStateContext.Provider value={activeStateValue}>
            <RestaurantSelectionContext.Provider value={restaurantSelectionValue}>
              {children}
            </RestaurantSelectionContext.Provider>
          </ActiveStateContext.Provider>
        </HoverStateContext.Provider>
      </UserContext.Provider>
    </CartContext.Provider>
  );
};
