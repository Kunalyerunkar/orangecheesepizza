import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Set default Axios configuration
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.timeout = 15000; // 15 seconds

// Global error handler
const handleGlobalError = (event: ErrorEvent) => {
  console.error("Unhandled error:", event.error);
  event.preventDefault();

  // Display a simple error message for unhandled errors
  const errorElement = document.createElement("div");
  errorElement.style.position = "fixed";
  errorElement.style.top = "0";
  errorElement.style.left = "0";
  errorElement.style.width = "100%";
  errorElement.style.padding = "20px";
  errorElement.style.backgroundColor = "#FEE2E2";
  errorElement.style.color = "#B91C1C";
  errorElement.style.textAlign = "center";
  errorElement.style.zIndex = "9999";
  errorElement.innerHTML = `
    <p style="font-weight: bold; margin-bottom: 8px;">Something went wrong</p>
    <p style="font-size: 14px;">${
      event.error?.message || "An unknown error occurred"
    }</p>
    <button 
      style="margin-top: 8px; padding: 8px 16px; background-color: #ff5722; color: white; border: none; border-radius: 4px; cursor: pointer;"
      onclick="window.location.reload()"
    >
      Reload Page
    </button>
  `;

  document.body.appendChild(errorElement);
};

// Add global error handlers
window.addEventListener("error", handleGlobalError);
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  handleGlobalError(new ErrorEvent("error", { error: event.reason }));
  event.preventDefault();
});

// Get the root element
const rootElement = document.getElementById("root");

// Make sure it exists before rendering
if (!rootElement) {
  console.error("Root element not found, cannot mount React application");
  document.body.innerHTML =
    '<div style="text-align: center; padding: 20px;">Error: Could not find root element to mount application.</div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error rendering React application:", error);
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2>Failed to start application</h2>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
        <p style="color: red; margin-top: 10px;">${
          error instanceof Error ? error.message : "Unknown error"
        }</p>
      </div>
    `;
  }
}
