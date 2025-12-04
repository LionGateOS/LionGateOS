import React from "react";

const Topbar: React.FC = () => {
  return (
    <header className="os-topbar">
      <div className="os-topbar-left">
        <span className="os-logo-glyph" aria-hidden="true">
          🦁
        </span>
        <div className="os-topbar-text">
          <span className="os-topbar-title">LionGateOS Shell</span>
          <span className="os-topbar-subtitle">
            Phase 5.6 · Performance Optimization
          </span>
        </div>
      </div>
      <div className="os-topbar-right">
        <span className="os-topbar-pill">Balanced Mode</span>
      </div>
    </header>
  );
};

export default Topbar;
