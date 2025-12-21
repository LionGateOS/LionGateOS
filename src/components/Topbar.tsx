import React from "react";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

const Topbar: React.FC = () => {
  return (
    <header className="os-topbar">
      <div className="os-topbar-left">
        <span className="os-logo-glyph" aria-hidden="true">🦁</span>

        <div className="os-topbar-text">
          <span className="os-topbar-title">LionGateOS Shell</span>
          <span className="os-topbar-subtitle">
            Workspaces · Top Bar Beans Restored
          </span>
        </div>
      </div>

      {/* PRIMARY: Workspace beans live in the TOP BAR */}
      <div className="os-topbar-center" aria-label="Workspace Tabs">
        <WorkspaceSwitcher />
      </div>

      <div className="os-topbar-right">
        <span className="os-topbar-pill">Hybrid Workspaces</span>
      </div>
    </header>
  );
};

export default Topbar;
