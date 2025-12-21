import React, { useMemo } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { APP_REGISTRY } from "../appRegistry";
import AppTile from "./AppTile";
import { getWorkspaceStatus } from "../workspaceStatus";

type OutletCtx = {
  openWorkspaceByRoute: (route: string) => void;
};

export default function Dashboard(): JSX.Element {
  const { openWorkspaceByRoute } = useOutletContext<OutletCtx>();
  const location = useLocation();

  const tiles = useMemo(() => {
    return APP_REGISTRY.map((app) => {
      const status = getWorkspaceStatus(app.id);

      return {
        app,
        status:
          status === "active"
            ? "Active"
            : status === "attention"
              ? "Needs attention"
              : "Idle",
      };
    });
  }, [location.pathname]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 18, fontWeight: 800 }}>
          Central Dashboard
        </div>
        <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, marginTop: 4 }}>
          Open apps into OS workspaces. Status is managed by the system.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {tiles.map(({ app, status }) => (
          <AppTile
            key={app.id}
            app={app}
            status={status}
            onOpen={() => openWorkspaceByRoute(app.defaultRoute)}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          borderRadius: 14,
          border: "1px dashed rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.02)",
          padding: 12,
          color: "rgba(255,255,255,0.70)",
          fontSize: 12,
        }}
      >
        Status indicators are OS-owned. Alerts and notifications will surface here in a later step.
      </div>
    </div>
  );
}
