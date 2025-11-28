import React from "react";
import { Sidebar } from "../navigation/Sidebar";
import { Topbar } from "../navigation/Topbar";
import type { ToolId } from "../../../src/App";

interface AppShellProps {
  activeTool: ToolId;
  onChangeTool: (id: ToolId) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTool,
  onChangeTool,
  children
}) => {
  return (
    <>
      <div className="glass-panel sidebar-root">
        <Sidebar activeTool={activeTool} onChangeTool={onChangeTool} />
      </div>
      <main className="app-main-surface">
        <div className="glass-panel">
          <Topbar activeTool={activeTool} />
        </div>
        <div className="app-main-inner">
          <section className="app-main-column">{children}</section>
          <aside className="app-main-column-secondary">
            <h3 style={{ marginTop: 0, fontSize: 13, opacity: 0.9 }}>
              ConstructOS Activity
            </h3>
            <p style={{ fontSize: 12, opacity: 0.8 }}>
              This panel will later show backups, sync status, AI insight, and
              safety/code notes. For now it confirms the OS shell is wired and
              ready for tools.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              <span className="chip chip-strong">OS Shell Online</span>
              <span className="chip">Local Workspace</span>
              <span className="chip">Estimator Tool Loaded</span>
              <span className="chip">Document Generator Ready</span>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};
