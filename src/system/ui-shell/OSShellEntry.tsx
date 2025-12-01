import React from "react";
import { loadShellState } from "../osShellLoader";
import { OSWorkspaceShell } from "./OSWorkspaceShell";
import { OSWorkspaceSidebar } from "./OSWorkspaceSidebar";
import { OSWorkspaceTopbar } from "./OSWorkspaceTopbar";
import manifest from "../../../system/shell-baseline/os-manifest.shell-baseline.json";

export const OSShellEntry = () => {
  const shellState = loadShellState();

  return (
    <OSWorkspaceShell
      osName={manifest.osName}
      tagline={manifest.tagline}
      shellState={shellState}
      sidebar={<OSWorkspaceSidebar />}
    >
      <OSWorkspaceTopbar />
      <div style={{ color: "white", padding: 20 }}>Workspace content area</div>
    </OSWorkspaceShell>
  );
};
