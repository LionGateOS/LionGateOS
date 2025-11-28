import React, { useState, useEffect } from "react";
import { AppShell } from "../core/os/layout/AppShell";
import { EstimatorPage } from "../core/os/routes/EstimatorPage";
import { BusinessPage } from "../core/os/routes/BusinessPage";
import { InvoicePage } from "../core/os/routes/InvoicePage";
import { AIPage } from "../core/os/routes/AIPage";
import { SplashScreen } from "./splash/SplashScreen";

export type ToolId = "estimator" | "business" | "invoice" | "ai";

export const App: React.FC = () => {

const [showSplash, setShowSplash] = useState(true);
const [activeTool, setActiveTool] = useState<ToolId>("estimator");

useEffect(() => {
  const timer = setTimeout(() => setShowSplash(false), 2200);
  return () => clearTimeout(timer);
}, []);

if (showSplash) {
  return (
    <div className="app-root app-root--splash-only">
      <SplashScreen />
    </div>
  );
}


  let content: React.ReactNode = null;
  if (activeTool === "estimator") content = <EstimatorPage />;
  if (activeTool === "business") content = <BusinessPage />;
  if (activeTool === "invoice") content = <InvoicePage />;
  if (activeTool === "ai") content = <AIPage />;

  return (
    <div className="app-root">
      <AppShell activeTool={activeTool} onChangeTool={setActiveTool}>
        {content}
      </AppShell>
    </div>
  );
};
