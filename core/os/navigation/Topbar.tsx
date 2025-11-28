import React from "react";
import { Cloud, ShieldCheck, Clock } from "lucide-react";
import type { ToolId } from "../../../src/App";

interface TopbarProps {
  activeTool: ToolId;
}

const toolTitle: Record<ToolId, string> = {
  estimator: "Estimator · Smart Line Items & Bundles",
  business: "Business Tools · Jobs, Backups & Controls",
  invoice: "Documents · Quotes & Invoices",
  ai: "AI Workspace · Future Safety & Inspector"
};

export const Topbar: React.FC<TopbarProps> = ({ activeTool }) => {
  return (
    <header className="topbar-root">
      <div>
        <div className="topbar-title-main">{toolTitle[activeTool]}</div>
        <div className="topbar-title-sub">
          ConstructOS core shell — navigation, layout and shared tooling.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div className="topbar-pill">
          <Cloud size={13} />
          <span>Local Dev · GitHub backup ready</span>
        </div>
        <div className="topbar-pill">
          <ShieldCheck size={13} />
          <span>Safety & Green Book: planned</span>
        </div>
        <div className="topbar-pill">
          <Clock size={13} />
          <span>v0.1 · Shell Prototype</span>
        </div>
      </div>
    </header>
  );
};
