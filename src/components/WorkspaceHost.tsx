import React, { useEffect, useMemo, useState } from "react";

type PanelConfig = {
  title: string;
  body: string;
};

const STORAGE_KEY = "lgos.shell.activePanel";
const DEFAULT_PANEL_ID = "dashboard";

const getInitialPanelId = (): string => {
  if (typeof window === "undefined") return DEFAULT_PANEL_ID;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored || DEFAULT_PANEL_ID;
  } catch {
    return DEFAULT_PANEL_ID;
  }
};

const WorkspaceHostComponent: React.FC = () => {
  const [activePanelId, setActivePanelId] = useState<string>(() =>
    getInitialPanelId()
  );

  const panels = useMemo<Record<string, PanelConfig>>(
    () => ({
      dashboard: {
        title: "Command Center",
        body: "High-level overview of LionGateOS activity, shell status, and global behavior.",
      },
      "workspace-hub": {
        title: "Workspace Hub",
        body: "Entry point for OS workspaces, shells, and tools. Phase 6 will attach dynamic workspaces here.",
      },
      smartquote: {
        title: "SmartQuote AI",
        body: "Shell bridge into the SmartQuote AI application surface.",
      },
      "travel-orchestrator": {
        title: "Travel Orchestrator",
        body: "Shell bridge into the Travel Orchestrator experience.",
      },
      settings: {
        title: "System Settings",
        body: "Global OS configuration, preferences, and automation behavior.",
      },
      "theme-engine": {
        title: "Theme Engine",
        body: "Manage palettes, wallpapers, and style modes across LionGateOS.",
      },
      "shell-diagnostics": {
        title: "Shell Diagnostics",
        body: "Phase 5 Shell health, error logs, routing, and mount status.",
      },
    }),
    []
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ routeId?: string }>;
      const routeId = custom.detail?.routeId;
      if (!routeId || routeId === activePanelId) return;

      setActivePanelId(routeId);

      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, routeId);
        }
      } catch {
        // ignore storage issues
      }
    };

    window.addEventListener("os-shell:navigate", handler as EventListener);
    return () => {
      window.removeEventListener(
        "os-shell:navigate",
        handler as EventListener
      );
    };
  }, [activePanelId]);

  const panel = panels[activePanelId] ?? panels[DEFAULT_PANEL_ID];

  return (
    <main className="os-workspace-host os-animate-panel os-perf-balanced">
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
            <span className="os-status-value">
              5.6 · Performance Optimization (Balanced)
            </span>
          </div>
          <div className="os-status-row">
            <span className="os-status-label">Sidebar</span>
            <span className="os-status-value">
              Expanded · Persistent
            </span>
          </div>
          <div className="os-status-row">
            <span className="os-status-label">Protection</span>
            <span className="os-status-value">
              SECL · Error boundaries active
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

const WorkspaceHost = React.memo(WorkspaceHostComponent);
WorkspaceHost.displayName = "WorkspaceHost";

export default WorkspaceHost;
