import React from 'react';
import { useWorkspaceEngine } from '../engine/workspaceEngine.jsx';

function SidebarButton({ title, isActive, onClick }) {
  return (
    <button
      type="button"
      className={`sidebar-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="dot" />
      {title}
    </button>
  );
}

export default function Sidebar() {
  const { openView, activeViewId } = useWorkspaceEngine();

  const sidebarGroups = {
    SYSTEM: [
      { id: 'home', title: 'Command Center' },
      { id: 'system-logs', title: 'System Logs' },
      { id: 'settings', title: 'OS Settings' },
      { id: 'docs', title: 'Documentation' },
      { id: 'app-store', title: 'App Store' },
      { id: 'security-center', title: 'Security Center' },
      { id: 'security-events', title: 'Security Events' },
    ],
    APPS: [
      { id: 'travel-orchestrator', title: 'Travel Orchestrator' },
      { id: 'smartquoteai', title: 'SmartQuote AI' },
    ],
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-title">
        <div className="status-dot" />
        System Online
      </div>

      <div className="sidebar-description">
        Views open in the workspace as tabs. Use the sidebar to launch or refocus them.
      </div>

      <div className="sidebar-section">SYSTEM</div>
      {sidebarGroups.SYSTEM.map((item) => (
        <SidebarButton
          key={item.id}
          title={item.title}
          isActive={activeViewId === item.id}
          onClick={() => openView(item.id)}
        />
      ))}

      <div className="sidebar-section">APPS</div>
      {sidebarGroups.APPS.map((item) => (
        <SidebarButton
          key={item.id}
          title={item.title}
          isActive={activeViewId === item.id}
          onClick={() => openView(item.id)}
        />
      ))}

      <div className="sidebar-footer">
        <div className="footer-card">
          <div className="footer-title">Workspace Engine · Stable</div>
          <div className="footer-subtitle">
            Phase 6.4 tabs are the baseline. Split views and grids can be added later without breaking this layout.
          </div>
        </div>
      </div>
    </nav>
  );
}
