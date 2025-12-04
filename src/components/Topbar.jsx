import React from "react";
export default function Topbar() {
  return (
    <header className="os-topbar">
      <div className="os-topbar-left">
        <span className="os-logo-glyph">🦁</span>
        <span className="os-topbar-title">LionGateOS Shell</span>
      </div>
      <div className="os-topbar-right">
        <span className="os-topbar-pill">Phase 5 · Shell Recovery</span>
      </div>
    </header>
  );
}
