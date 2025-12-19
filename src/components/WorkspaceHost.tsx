import React, { useEffect, useMemo, useState } from "react";

type PanelConfig = {
  title: string;
  body: string;
};

const ACTIVE_KEY = "lgos.shell.activePanel";
const OPEN_KEY = "lgos.shell.openPanels";

const DEFAULT_PANEL_ID = "dashboard";

const safeRead = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeWrite = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage issues
  }
};

const parseOpenPanels = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
    return [];
  } catch {
    return [];
  }
};

const WorkspaceHostComponent: React.FC = () => {
  const panels = useMemo<Record<string, PanelConfig>>(
    () => ({
      dashboard: {
        title: "Command Center",
        body: "High-level overview of LionGateOS activity, shell status, and global behavior.",
      },
      "workspace-hub": {
        title: "Workspace Hub",
        body: "Entry point for OS workspaces, shells, and tools. Phase 6 attaches dynamic workspaces here.",
      },
      smartquote: {
        title: "SmartQuote AI",
        body: "Shell bridge into the SmartQuote AI application surface.",
      },
      "travel-orchestrator": {
        title: "LionGate Travels",
        body: "Shell bridge into the LionGate Travels experience.",
      },
      settings: {
        title: "System Settings",
        body: "Global OS configuration, preferences, and automation behavior.",
      },
      documentation: {
        title: "OS Docs",
        body: "LionGateOS documentation surface (Phase 6 placeholder).",
      },
      "theme-engine": {
        title: "Theme Engine",
        body: "Manage palettes, wallpapers, and style modes across LionGateOS.",
      },
      "shell-diagnostics": {
        title: "Shell Diagnostics",
        body: "Shell health, error logs, routing, and mount status.",
      },
    }),
    []
  );

  // Active panel
  const [activePanelId, setActivePanelId] = useState<string>(() => {
    const stored = safeRead(ACTIVE_KEY);
    return stored || DEFAULT_PANEL_ID;
  });

  // Open panels (tabs)
  const [openPanels, setOpenPanels] = useState<string[]>(() => {
    const stored = parseOpenPanels(safeRead(OPEN_KEY));
    const active = safeRead(ACTIVE_KEY) || DEFAULT_PANEL_ID;

    // Always ensure at least the active panel is open.
    const merged = Array.from(new Set([active, ...stored]));
    return merged.length ? merged : [DEFAULT_PANEL_ID];
  });

  const ensureOpenAndActivate = (id: string) => {
    setOpenPanels((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      safeWrite(OPEN_KEY, JSON.stringify(next));
      return next;
    });

    setActivePanelId(id);
    safeWrite(ACTIVE_KEY, id);
  };

  const closeTab = (id: string) => {
    setOpenPanels((prev) => {
      const next = prev.filter((x) => x !== id);
      const finalTabs = next.length ? next : [DEFAULT_PANEL_ID];

      safeWrite(OPEN_KEY, JSON.stringify(finalTabs));

      // If we closed the active tab, activate a safe fallback.
      if (id === activePanelId) {
        const fallback = finalTabs[finalTabs.length - 1] || DEFAULT_PANEL_ID;
        setActivePanelId(fallback);
        safeWrite(ACTIVE_KEY, fallback);

        // Keep shell nav in sync (so sidebar selection also moves).
        try {
          const event = new CustomEvent("os-shell:navigate", {
            detail: { routeId: fallback, source: "workspace-tabs" },
          });
          window.dispatchEvent(event);
        } catch {
          // ignore
        }
      }

      return finalTabs;
    });
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ routeId?: string; source?: string }>;
      const routeId = custom.detail?.routeId;
      if (!routeId) return;

      // Avoid loops if we fired the event from tabs (we already updated state).
      if (custom.detail?.source === "workspace-tabs") return;

      ensureOpenAndActivate(routeId);
    };

    window.addEventListener("os-shell:navigate", handler as EventListener);
    return () => window.removeEventListener("os-shell:navigate", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panel = panels[activePanelId] ?? panels[DEFAULT_PANEL_ID];

  return (
    <main className="os-workspace-host os-perf-balanced">
      <div className="os-workspace-tabs" role="tablist" aria-label="Workspace Tabs">
        {openPanels.map((id) => {
          const title = (panels[id]?.title ?? id).trim();
          const isActive = id === activePanelId;

          return (
            <button
              key={id}
              type="button"
              className={"os-workspace-tab" + (isActive ? " is-active" : "")}
              onClick={() => ensureOpenAndActivate(id)}
              role="tab"
              aria-selected={isActive}
            >
              <span className="os-workspace-tab-dot" aria-hidden="true" />
              <span className="os-workspace-tab-title">{title}</span>
              <span className="os-workspace-tab-close-wrap">
                <span
                  className="os-workspace-tab-close"
                  role="button"
                  aria-label={`Close ${title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTab(id);
                  }}
                >
                  ×
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div key={activePanelId} className="os-workspace-panel os-animate-panel">
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
              <span className="os-status-value">6.4 · Workspace Tabs + Persistence</span>
            </div>

            <div className="os-status-row">
              <span className="os-status-label">Workspaces</span>
              <span className="os-status-value">
                {openPanels.length} open · Active: {(panels[activePanelId]?.title ?? activePanelId)}
              </span>
            </div>

            <div className="os-status-row">
              <span className="os-status-label">Protection</span>
              <span className="os-status-value">SECL · Error boundaries active</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const WorkspaceHost = React.memo(WorkspaceHostComponent);
WorkspaceHost.displayName = "WorkspaceHost";

export default WorkspaceHost;
