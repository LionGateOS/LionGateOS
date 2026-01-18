import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import EstimatorHome from "../tools/estimator/ui/EstimatorHome";
import BusinessProfile from "./pages/BusinessProfile";
import Expenses from "./pages/Expenses";
import AIReview from "./pages/AIReview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EstimatorHome />} />
      <Route path="/estimator" element={<EstimatorHome />} />
      <Route path="/business-profile" element={<BusinessProfile />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/ai-review" element={<AIReview />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
