import React from "react";

const Topbar: React.FC = () => {
  return (
    <header className="os-topbar">
      <div className="os-topbar-left">
        <span className="os-logo-glyph" aria-hidden="true">🦁</span>
        <span className="os-topbar-title">LionGateOS Shell</span>
      </div>
      <div className="os-topbar-right">
        <span className="os-topbar-pill">Phase 5 · Shell Recovery</span>
      </div>
    </header>
  );
};

export default Topbar;
