import React from "react";
import { Calculator, Files, Wand2, LayoutDashboard } from "lucide-react";
import type { ToolId } from "../../../src/App";

interface SidebarProps {
  activeTool: ToolId;
  onChangeTool: (id: ToolId) => void;
}

const tools: {
  id: ToolId;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "estimator",
    label: "Estimator",
    description: "Presets, bundles, quantity helpers",
    icon: <Calculator size={16} />
  },
  {
    id: "business",
    label: "Business Tools",
    description: "Backups, contracts, job controls",
    icon: <LayoutDashboard size={16} />
  },
  {
    id: "invoice",
    label: "Invoices",
    description: "Quotes, invoices, client documents",
    icon: <Files size={16} />
  },
  {
    id: "ai",
    label: "AI Workspace",
    description: "Future safety, inspector, camera AI",
    icon: <Wand2 size={16} />
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onChangeTool }) => {
  return (
    <>
      <header className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="sidebar-logo-mark-inner" />
        </div>
        <div>
          <div className="sidebar-logo-text-main">ConstructOS</div>
          <div className="sidebar-logo-text-sub">
            Estimator · Docs · Inspector (future)
          </div>
        </div>
      </header>
      <div>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={
                "sidebar-item glass-panel " +
                (tool.id === activeTool ? "sidebar-item-active" : "")
              }
              onClick={() => onChangeTool(tool.id)}
            >
              <span>{tool.icon}</span>
              <span style={{ textAlign: "left" }}>
                <div className="sidebar-item-label-main">{tool.label}</div>
                <div className="sidebar-item-label-sub">{tool.description}</div>
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};
