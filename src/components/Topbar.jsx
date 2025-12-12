import React from 'react';
import { useWorkspaceEngine } from '../engine/workspaceEngine.jsx';

export default function Topbar() {
  const { activeViewDefinition } = useWorkspaceEngine();

  return (
    <div
      style={{
        height: '100%',
        borderRadius: '999px',
        border: '1px solid rgba(148, 163, 184, 0.35)',
        background:
          'radial-gradient(circle at top left, rgba(79, 140, 255, 0.22), rgba(15, 23, 42, 0.96))',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background:
            'radial-gradient(circle at top left, rgba(251, 191, 36, 0.22), rgba(30, 64, 175, 0.85))',
          border: '1px solid rgba(251, 191, 36, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
        }}
      >
        LG
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, opacity: 0.85 }}>LionGateOS</span>
          <span className="badge-soft">Phase 6.4.4 · Multi-View Workspace</span>
        </div>
        <span className="text-soft">
          {activeViewDefinition?.title
            ? `Active View: ${activeViewDefinition.title}`
            : 'No active view'}
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
        }}
      >
        <span className="text-soft">Keyboard</span>
        <span className="badge-soft">Ctrl+Alt+←/→ Tabs</span>
        <span className="badge-soft">Ctrl+Alt+W Close</span>
        <span className="badge-soft">Alt+1–9 Jump</span>
      </div>
    </div>
  );
}
