import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WorkspaceHost from "./components/WorkspaceHost";
import Dashboard from "./system/dashboard/Dashboard";

function Banner() {
  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        top: 12,
        zIndex: 9999,
        padding: "8px 10px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.35)",
        color: "rgba(255,255,255,0.92)",
        fontSize: 12,
        backdropFilter: "blur(8px)",
      }}
    >
      LionGateOS UI Loaded
    </div>
  );
}

function PageShell({ title }: { title: string }) {
  return (
    <div style={{ padding: 16, color: "rgba(255,255,255,0.92)" }}>
      <h2 style={{ margin: "0 0 8px 0", fontSize: 18 }}>{title}</h2>
      <div style={{ opacity: 0.82, fontSize: 14 }}>
        If you can read this, routing is connected and the top-bar workspace beans should be visible above.
      </div>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Banner />
      <Routes>
        <Route path="/" element={<Navigate to="/hub" replace />} />
        <Route element={<WorkspaceHost />}>
          <Route path="/hub" element={<Dashboard />} />
          <Route path="/command" element={<PageShell title="Command Center" />} />
          <Route path="/smartquote" element={<PageShell title="SmartQuote AI" />} />
          <Route path="/travels" element={<PageShell title="LionGate Travels" />} />
          <Route path="/settings" element={<PageShell title="Settings" />} />
          <Route path="/security" element={<PageShell title="Security Center" />} />
          <Route path="*" element={<PageShell title="Workspace" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
