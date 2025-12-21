import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WorkspaceHost from "./components/WorkspaceHost";
import Dashboard from "./system/dashboard/Dashboard";

/**
 * NOTE:
 * This file defines the OS-level workspace routes.
 * If a specific app UI is not yet mounted, we render a safe placeholder
 * so "Open" produces visible navigation and does not appear broken.
 */

function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ padding: 18, color: "rgba(255,255,255,0.85)" }}>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
        This workspace is mounted. App UI wiring will be connected in the next step.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<WorkspaceHost />}>
        <Route path="/hub" element={<Dashboard />} />

        {/* Core workspaces */}
        <Route path="/command" element={<Placeholder title="Command Center" />} />
        <Route path="/settings" element={<Placeholder title="Settings" />} />

        {/* App workspaces */}
        <Route path="/smartquote" element={<Placeholder title="SmartQuote AI" />} />
        <Route path="/travels" element={<Placeholder title="LionGate Travels" />} />

        <Route path="/" element={<Navigate to="/hub" replace />} />
        <Route path="*" element={<Navigate to="/hub" replace />} />
      </Route>
    </Routes>
  );
}