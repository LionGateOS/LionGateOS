import React from "react";
import { ThemeProvider } from "./theme/provider/ThemeProvider";
import { OSModeGate } from "./system/OSModeGate";
import { AppShellWrapper } from "./system/AppShellWrapper";

export function App() {
  return (
    <ThemeProvider>
      <OSModeGate>
        <AppShellWrapper />
      </OSModeGate>
    </ThemeProvider>
  );
}
