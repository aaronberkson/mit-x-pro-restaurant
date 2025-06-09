import React, { createContext, useState, useContext } from "react";

// Create the context
const SearchContext = createContext();

// Provider to manage and expose state
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query shared across components
  const [restaurantNames, setRestaurantNames] = useState([]); // Preloaded restaurant names

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, restaurantNames, setRestaurantNames }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for accessing the context
export const useSearchContext = () => useContext(SearchContext);
