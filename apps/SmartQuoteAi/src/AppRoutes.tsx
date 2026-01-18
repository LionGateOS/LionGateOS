import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import EstimatorHome from "../tools/estimator/ui/EstimatorHome";
import BusinessProfile from "./pages/BusinessProfile";
import Expenses from "./pages/Expenses";
import AIReview from "./pages/AIReview";

// DEV-ONLY ROUTES
import { BusinessProfilePage } from "./business-profile/BusinessProfilePage";
import { ExpensesPage } from "./expenses/ExpensesPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EstimatorHome />} />
      <Route path="/estimator" element={<EstimatorHome />} />
      <Route path="/business-profile" element={<BusinessProfile />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/ai-review" element={<AIReview />} />

      {/* DEV-ONLY ROUTES — READ-ONLY / NO AI */}
      <Route path="/dev/business-profile" element={<BusinessProfilePage />} />
      <Route path="/dev/expenses" element={<ExpensesPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
