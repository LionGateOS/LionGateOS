import React from "react";
import { EstimatorHome } from "../../../tools/estimator/ui/EstimatorHome";

export const EstimatorPage: React.FC = () => {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Estimator Tool</h2>
      <p style={{ fontSize: 13, opacity: 0.85 }}>
        This is the first LionGateOS app. It will grow to include presets,
        bundles, quantity helpers, market pricing, and camera-based AI.
      </p>
      <div style={{ marginTop: 12 }}>
        <EstimatorHome />
      </div>
    </>
  );
};
