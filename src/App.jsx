import React from 'react';
import Topbar from './components/Topbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import WorkspaceTabs from './components/WorkspaceTabs.jsx';
import WorkspaceHost from './components/WorkspaceHost.jsx';
import { WorkspaceEngineProvider } from './engine/workspaceEngine.jsx';

export default function App() {
  return (
    <WorkspaceEngineProvider>
      <div className="app-shell">
        <div className="app-shell-surface">
          <header className="app-topbar">
            <Topbar />
          </header>
          <aside className="app-sidebar">
            <Sidebar />
          </aside>
          <section className="app-tabs">
            <WorkspaceTabs />
          </section>
          <main className="app-main">
            <div className="app-main-inner" aria-label="LionGateOS Workspace">
              <div className="app-main-scroll">
                <WorkspaceHost />
              </div>
            </div>
          </main>
        </div>
      </div>
    </WorkspaceEngineProvider>
  );
}
