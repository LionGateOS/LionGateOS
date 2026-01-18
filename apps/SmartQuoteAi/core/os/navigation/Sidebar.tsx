import React from "react";
import { Calculator, FileText, ListChecks, Wand2, Share2 } from "lucide-react";
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
    id: "estimate",
    label: "Estimate",
    description: "Estimator engine",
    icon: <Calculator size={18} />
  },
  {
    id: "proposal",
    label: "Proposal",
    description: "Client docs",
    icon: <FileText size={18} />
  },
  {
    id: "scope",
    label: "Scope",
    description: "Work definition",
    icon: <ListChecks size={18} />
  },
  {
    id: "aiTools",
    label: "AI Tools",
    description: "Assistants",
    icon: <Wand2 size={18} />
  },
  {
    id: "export",
    label: "Export",
    description: "PDF & DOCX",
    icon: <Share2 size={18} />
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onChangeTool }) => {
  return (
    <>
      <div className="sidebar-root">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <div className="sidebar-brand-title">SmartQuoteAi Pro</div>
            <div className="sidebar-brand-sub">Universal Hybrid Shell · NeonShell v2.2</div>
          </div>

          <nav className="sidebar-nav sidebar-nav-circles">
            {tools.map((tool) => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  className={"sidebar-item" + (isActive ? " sidebar-item-active" : "")}
                  onClick={() => onChangeTool(tool.id)}
                >
                  <span className="sidebar-circle">{tool.icon}</span>
                  <span className="sidebar-item-label-main">{tool.label}</span>
                  <span className="sidebar-item-label-sub">{tool.description}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
