import React from "react";
import { OSWorkspaceShell } from "./OSWorkspaceShell";

export const OSShellEntry: React.FC = () => {
  return (
    <div className="lgos-shell-root">
      <OSWorkspaceShell mode="soft" />
    </div>
  );
};