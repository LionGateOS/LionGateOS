import React from "react";

export const SplashScreen: React.FC = () => {
  return (
    <div className="splash-root">
      <div className="splash-glow" />
      <div className="splash-card">
        <div className="splash-logo-wrap">
          <img
            src="/assets/branding/LionGateOS_Logo.png"
            alt="LionGateOS logo"
            className="splash-logo"
          />
          <div className="splash-shimmer-layer" />
        </div>
        <p className="splash-tagline">Smart OS for Construction Teams</p>
        <p className="splash-loading">Loading workspace…</p>
      </div>
    </div>
  );
};
