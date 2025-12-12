import React from 'react';
import { useWorkspaceEngine } from '../engine/workspaceEngine.jsx';

export default function WorkspaceTabs() {
  const { views, activeViewId, switchView, closeView, openView } = useWorkspaceEngine();

  React.useEffect(() => { if (!views.length) openView('home'); }, [views.length, openView]);

  const renderTab = (view) => {
    const isActive = view.id === activeViewId;
    return (
      <div
        key={view.id}
        role="tab"
        aria-selected={isActive}
        onClick={() => switchView(view.id)}
        style={{
          position: 'relative',
          flexShrink: 0,
          maxWidth: 220,
          minWidth: 120,
          height: '100%',
          borderRadius: 999,
          border: isActive ? '1px solid rgba(191,219,254,0.95)' : '1px solid rgba(148,163,184,0.6)',
          padding: '0 10px',
          marginRight: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          background: isActive
            ? 'radial-gradient(circle at top left, rgba(79,140,255,0.45), rgba(15,23,42,0.98))'
            : 'radial-gradient(circle at top left, rgba(51,65,85,0.55), rgba(15,23,42,0.96))',
          boxShadow: isActive
            ? '0 16px 36px rgba(79,140,255,0.65)'
            : '0 10px 24px rgba(0,0,0,0.7)',
          fontSize: 12,
          transition: 'background 150ms ease-out, border-color 150ms ease-out, transform 80ms ease-out, box-shadow 150ms ease-out',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: isActive ? '#60a5fa' : '#6b7280',
            boxShadow: isActive ? '0 0 16px rgba(96,165,250,0.95)' : 'none',
          }}
        />
        <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {view.title}
        </span>
        <button
          type="button"
          onClick={(e)=>{e.stopPropagation(); closeView(view.id);}}
          style={{
            marginLeft:'auto',
            borderRadius:999, border:'none',
            width:18, height:18,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:11, cursor:'pointer',
            background:'rgba(15,23,42,0.9)',
            color:'rgba(249,250,251,0.9)'
          }}>
          ×
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        height:'100%',
        borderRadius:999,
        border:'1px solid rgba(148,163,184,0.45)',
        background:'linear-gradient(120deg, rgba(15,23,42,0.95), rgba(15,23,42,0.92))',
        display:'flex',
        alignItems:'center',
        padding:'0 6px',
        gap:8,
        overflow:'hidden'
      }}
    >
      <div
        style={{
          flex:1,
          display:'flex',
          alignItems:'center',
          overflow:'hidden',
          padding:'0 2px',
        }}
      >
        {views.map(renderTab)}
      </div>
      <button type="button" onClick={()=>openView('home')} style={{
        borderRadius:999,
        padding:'4px 10px',
        background:'rgba(15,23,42,0.75)',
        color:'white',
        border:'1px solid rgba(148,163,184,0.45)',
        cursor:'pointer'
      }}>
        + New Home View
      </button>
    </div>
  );
}
