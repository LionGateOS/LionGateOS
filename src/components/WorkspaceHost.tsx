import React, { useEffect, useState } from "react";

type PanelConfig = {
  title: string;
  body: string;
};

const PANELS: Record<string, PanelConfig> = {
  "dashboard": {
    title: "Command Center",
    body: "High-level overview of LionGateOS activity and status.",
  },
  "workspace-hub": {
    title: "Workspace Hub",
    body: "Entry point for OS workspaces, shells, and tools.",
  },
  "smartquote": {
    title: "SmartQuote AI",
    body: "Shell bridge into the SmartQuote AI application.",
  },
  "travel-orchestrator": {
    title: "Travel Orchestrator",
    body: "Shell bridge into the Travel Orchestrator application.",
  },
  "settings": {
    title: "System Settings",
    body: "Global OS configuration, preferences, and behavior rules.",
  },
  "theme-engine": {
    title: "Theme Engine",
    body: "Manage palettes, wallpapers, and style modes.",
  },
  "shell-diagnostics": {
    title: "Shell Diagnostics",
    body: "Phase 5 shell health, routing, and mount status.",
  },
};

const DEFAULT_PANEL_ID = "dashboard";

const WorkspaceHost: React.FC = () => {
  const [activePanelId, setActivePanelId] = useState<string>(DEFAULT_PANEL_ID);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ routeId?: string }>;
      const routeId = custom.detail?.routeId;
      if (!routeId) return;
      setActivePanelId(routeId);
    };

    window.addEventListener("os-shell:navigate", handler as EventListener);
    return () => {
      window.removeEventListener("os-shell:navigate", handler as EventListener);
    };
  }, []);

  const panel = PANELS[activePanelId] ?? PANELS[DEFAULT_PANEL_ID];

  return (
    <main className="os-workspace-host">
      <div className="os-workspace-header">
        <h1 className="os-workspace-title">{panel.title}</h1>
        <span className="os-workspace-tag">Workspace</span>
      </div>
      <section className="os-workspace-body">
        <p className="os-workspace-text">{panel.body}</p>
        <div className="os-workspace-status-card">
          <div className="os-status-pill os-status-pill-ok">Shell Online</div>
          <div className="os-status-row">
            <span className="os-status-label">Phase</span>
            <span className="os-status-value">5 · Recovery</span>
          </div>
          <div className="os-status-row">
            <span className="os-status-label">Sidebar</span>
            <span className="os-status-value">Expanded</span>
          </div>
          <div className="os-status-row">
            <span className="os-status-label">Routing</span>
            <span className="os-status-value">Local event bus</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WorkspaceHost;
