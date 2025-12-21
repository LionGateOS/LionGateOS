import React, { useEffect, useMemo, useState } from "react";
import orchestrator from "./WorkspaceOrchestrator";

// Existing views in this codebase are JSX.
// allowJs is enabled in tsconfig for compatibility.
import HomeView from "../views/HomeView.jsx";
import SmartQuoteAIView from "../views/SmartQuoteAIView.jsx";
import SettingsView from "../views/SettingsView.jsx";
import SecurityCenterView from "../views/SecurityCenterView.jsx";
import SystemLogsView from "../views/SystemLogsView.jsx";
import TravelOrchestratorView from "../views/TravelOrchestratorView.jsx";
import DocsView from "../views/DocsView.jsx";
import AppStoreView from "../views/AppStoreView.jsx";

type ViewComponent = React.ComponentType;

const VIEW_MAP: Record<string, ViewComponent> = {
  dashboard: HomeView,
  "workspace-hub": HomeView,

  smartquote: SmartQuoteAIView,

  settings: SettingsView,

  "security-center": SecurityCenterView,

  system: SystemLogsView,
  "shell-diagnostics": SystemLogsView,

  "travel-orchestrator": TravelOrchestratorView,

  apps: AppStoreView,
  core: DocsView,
};

const FallbackView: React.FC<{ id: string }> = ({ id }) => (
  <div style={{ padding: 16, color: "rgba(255,255,255,0.92)" }}>
    <h2 style={{ margin: "0 0 8px 0", fontSize: 18 }}>Workspace</h2>
    <div style={{ opacity: 0.82, fontSize: 14 }}>
      No view is mapped for workspace id: <b>{id}</b>
    </div>
  </div>
);

export default function WorkspaceHost(): JSX.Element {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Subscribe to orchestrator changes; it provides subscribe(), not on().
    const unsub = orchestrator.subscribe(() => setTick((t) => t + 1));

    // Ensure we always have a visible default workspace so the UI never loads blank.
    const active = orchestrator.getActiveId();
    const open = orchestrator.getOpen();
    if (!active) {
      // Prefer dashboard; this matches orchestrator fallback logic.
      orchestrator.register({ id: "dashboard", title: "Workspace Hub", app: "workspace-hub" });
      orchestrator.activate("dashboard");
    } else if (!open.find((w) => w.id === active)) {
      // Active exists but isn't in list; repair.
      orchestrator.register({ id: active, title: "Workspace", app: active });
    }

    return unsub;
  }, []);

  const activeId = orchestrator.getActiveId() || "dashboard";

  const ActiveView = useMemo(() => {
    const View = VIEW_MAP[activeId];
    if (View) return View;
    return () => <FallbackView id={activeId} />;
  }, [activeId, tick]);

  return (
    <div className="os-workspace-host" aria-label="Workspace Host">
      <ActiveView />
    </div>
  );
}
