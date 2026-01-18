import React from "react";
import { BrowserRouter } from "react-router-dom";

import SparklesLayer from "./src/system/SparklesLayer";

import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global background sparkles */}
      <SparklesLayer />

      {/* Main application routes */}
      <AppRoutes />
    </BrowserRouter>
  );
}
