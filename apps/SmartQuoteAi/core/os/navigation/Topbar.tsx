import React from "react";
import type { ToolId } from "../../../src/App";

interface TopbarProps {
  activeTool: ToolId;
}

const toolTitle: Record<ToolId, string> = {
  estimate: "Estimator",
  proposal: "Proposals",
  scope: "Scopes",
  aiTools: "AI Tools",
  export: "Export"
};

const toolSubtitle: Record<ToolId, string> = {
  estimate: "Build clean estimates with calm, focused workflow.",
  proposal: "Generate client-facing proposals in seconds.",
  scope: "Define work scope, phases, and deliverables.",
  aiTools: "Assistive tools for speed and clarity.",
  export: "PDF, DOCX, and share-ready outputs."
};

export const Topbar: React.FC<TopbarProps> = ({ activeTool }) => {
  return (
    <div className="topbar-shell">
      <header className="topbar-root topbar-root-minimal">
        <div className="topbar-left">
          <div className="topbar-logo-mark" aria-hidden="true">
            <div className="topbar-orb" />
            <div className="topbar-orb-tail" />
          </div>
          <div className="topbar-product-block">
            <div className="topbar-product">SMARTQUOTEAI</div>
            <div className="topbar-build">Calm Estimating Workspace</div>
          </div>
        </div>

        <div className="topbar-center topbar-center-minimal">
          <div className="topbar-title-main">{toolTitle[activeTool]}</div>
          <div className="topbar-title-sub">{toolSubtitle[activeTool]}</div>
        </div>
      </header>
    </div>
  );
};
