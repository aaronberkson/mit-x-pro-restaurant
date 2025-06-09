import { createContext, useContext, useState } from "react";

// Create a Context for restaurantID
const RestaurantIDContext = createContext();

export const RestaurantIDProvider = ({ children }) => {
  const [restaurantID, setRestaurantID] = useState(null);

  // Function to update restaurantID
  const updateRestaurantID = (id) => {
    console.log("[GT][useRestaurantID] Updating restaurantID:", id);
    setRestaurantID(id);
  };

  return (
    <RestaurantIDContext.Provider value={{ restaurantID, updateRestaurantID }}>
      {children}
    </RestaurantIDContext.Provider>
  );
};

// Custom hook to use the RestaurantID context
export const useRestaurantID = () => {
  const context = useContext(RestaurantIDContext);
  if (!context) {
    throw new Error("useRestaurantID must be used within a RestaurantIDProvider");
  }
  return context;
};
