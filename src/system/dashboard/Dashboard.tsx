import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_REGISTRY } from "../appRegistry";
import AppTile, { AppStatus } from "./AppTile";

function statusForRoute(currentPath: string, route: string): AppStatus {
  if (currentPath === route || currentPath.startsWith(route + "/")) return "Active";
  return "Idle";
}

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const tiles = useMemo(() => {
    return APP_REGISTRY.map((app) => ({
      app,
      status: statusForRoute(location.pathname, app.defaultRoute),
    }));
  }, [location.pathname]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 18, fontWeight: 800 }}>
          Central Dashboard
        </div>
        <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, marginTop: 4 }}>
          Open apps into OS workspaces. Status is advisory only.
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
            onOpen={() => navigate(app.defaultRoute)}
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
        Alerts summary (Phase 1 placeholder).
      </div>
    </div>
  );
}
