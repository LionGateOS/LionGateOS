import React from "react";
import { OSShellEntry } from "./ui-shell/OSShellEntry";

export const OSModeGate = ({ children }) => {
  if (window.LGOS_SHELL_MODE === true) {
    return <OSShellEntry />;
  }
  return children;
};
