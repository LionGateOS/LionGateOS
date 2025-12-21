import React from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import WorkspaceHost from "./components/WorkspaceHost";

export default function App(): JSX.Element {
  return (
    <div className="app-shell">
      <div className="app-shell-surface">
        <header className="app-topbar">
          <Topbar />
        </header>

        <aside className="app-sidebar" aria-label="System Sidebar">
          <Sidebar />
        </aside>

        {/* Lower strip is intentionally de-emphasized in STEP 1; beans live in the top bar now. */}
        <main className="app-main">
          <div className="app-main-inner" aria-label="LionGateOS Workspace">
            <div className="app-main-scroll">
              <WorkspaceHost />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
