import React from "react";
import { OSModeGate } from "./OSModeGate";

export const AppShellWrapper = ({ children }) => {
  return <OSModeGate>{children}</OSModeGate>;
};
