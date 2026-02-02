import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getActiveWorkspace } from "../system/workspaceStatus";
import { getAppById } from "../system/appRegistry";

export default function WorkspaceHost() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveWorkspace();
    if (!active) {
      setSrc(null);
      return;
    }
    const app = getAppById(active);
    setSrc(app ? app.url : null);
  }, []);

  return (
    <div className="workspace-host" style={{ height: "100%", width: "100%" }}>
      {src ? (
        <iframe
          src={src}
          title="Workspace App"
          style={{ border: 0, width: "100%", height: "100%" }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
