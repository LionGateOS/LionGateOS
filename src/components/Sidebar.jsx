import React from 'react';
import { useWorkspaceEngine } from '../engine/workspaceEngine.jsx';

const sidebarGroups = [
  {
    label: 'SYSTEM',
    items: [
      { id: 'home', title: 'Command Center' },
      { id: 'system-logs', title: 'System Logs' },
      { id: 'settings', title: 'OS Settings' },
      { id: 'docs', title: 'Documentation' },
      { id: 'app-store', title: 'App Store' },
      { id: 'security-events', title: 'Security Events' },
    ],
  },
  {
    label: 'APPS',
    items: [
      { id: 'travel-orchestrator', title: 'Travel Orchestrator' },
      { id: 'smartquote-ai', title: 'SmartQuote AI' },
    ],
  },
];

function NeonIconDot() {
  return (
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: 999,
        background:
          'radial-gradient(circle at top left, rgba(56, 189, 248, 1), rgba(59, 130, 246, 1))',
        boxShadow: '0 0 12px rgba(56, 189, 248, 0.9)',
        flexShrink: 0,
      }}
    />
  );
}

export default function Sidebar() {
  const { openView, activeViewId } = useWorkspaceEngine();

  return (
    <nav
      aria-label="LionGateOS Navigation"
      style={{
        height: '100%',
        borderRadius: 18,
        border: '1px solid rgba(148, 163, 184, 0.4)',
        background:
          'linear-gradient(165deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92))',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            background:
              'radial-gradient(circle at top left, #22c55e, #16a34a)',
            boxShadow: '0 0 12px rgba(34, 197, 94, 0.75)',
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 500 }}>System Online</span>
      </div>

      <div style={{ fontSize: 11 }} className="text-soft">
        Views open in the workspace as tabs. Use the sidebar to launch or
        refocus them.
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingRight: 2 }}>
        {sidebarGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.9,
                marginBottom: 6,
                paddingLeft: 4,
              }}
            >
              {group.label}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {group.items.map((item) => {
                const isActive = activeViewId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => openView(item.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 999,
                      border: isActive
                        ? '1px solid rgba(191, 219, 254, 0.85)'
                        : '1px solid rgba(148, 163, 184, 0.5)',
                      padding: '6px 10px',
                      background: isActive
                        ? 'radial-gradient(circle at top left, rgba(79, 140, 255, 0.4), rgba(15, 23, 42, 0.95))'
                        : 'radial-gradient(circle at top left, rgba(51, 65, 85, 0.65), rgba(15, 23, 42, 0.98))',
                      color: 'inherit',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      boxShadow: isActive
                        ? '0 14px 30px rgba(37, 99, 235, 0.55)'
                        : '0 8px 20px rgba(0, 0, 0, 0.65)',
                      transition:
                        'background 140ms ease-out, border-color 140ms ease-out, transform 80ms ease-out, box-shadow 140ms ease-out',
                    }}
                  >
                    <NeonIconDot />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 11,
          borderRadius: 12,
          border: '1px dashed rgba(148, 163, 184, 0.6)',
          padding: 8,
          background:
            'linear-gradient(145deg, rgba(30, 64, 175, 0.25), rgba(15, 23, 42, 0.95))',
        }}
      >
        <div style={{ fontWeight: 500, marginBottom: 3 }}>
          Workspace Engine · Stable
        </div>
        <div className="text-soft">
          Phase 6.4 tabs are the baseline. Split views and grids can be added
          later without breaking this layout.
        </div>
      </div>
</nav>
  );
}
