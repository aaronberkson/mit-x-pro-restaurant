import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../styles/globals.css";

// [GT][main] Logging the start of the app initialization process
console.log("[GT][main] Starting app initialization...");

// Mount the React app to the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// [GT][main] Verifying root element exists
if (root) {
  console.log("[GT][main] Root element found. Proceeding to render the app...");
} else {
  console.error("[GT][main] Root element not found! Rendering cannot proceed.");
}

// Rendering the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// [GT][main] Successfully rendered the app
console.log("[GT][main] App rendered successfully.");
