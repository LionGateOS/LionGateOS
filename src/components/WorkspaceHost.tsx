import { Outlet } from "react-router-dom";

export default function WorkspaceHost() {
  return (
    <div className="workspace-host">
      <Outlet />
    </div>
  );
}