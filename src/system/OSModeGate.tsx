import React from "react";

/**
 * OSModeGate – simplified
 *
 * For now, always render the main application children and
 * disable the legacy OSShellEntry preview shell.
 *
 * This removes the dark StudioAI-style shell layer so we
 * can rebuild the LionGateOS shell cleanly in light mode.
 */
export const OSModeGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
