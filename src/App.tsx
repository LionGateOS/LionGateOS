import React from "react";
import "./theme/neonshell.theme.css";
import { ThemeProvider } from "./theme/provider/ThemeProvider";
import { OSModeGate } from "./system/OSModeGate";
import { AppShellWrapper } from "./system/AppShellWrapper";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <OSModeGate>
        <AppShellWrapper />
      </OSModeGate>
    </ThemeProvider>
  );
};

export default App;
