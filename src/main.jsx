/* eslint-disable no-unused-vars */
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  // <BrowserRouter>
  <App />
  // {/* </BrowserRouter> */}
  // </StrictMode>
);
