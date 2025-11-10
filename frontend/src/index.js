import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import { createRoot } from "react-dom/client"; // Use createRoot from react-dom/client
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container); // Create a root

root.render(
  <Router
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <App />
  </Router>
);
