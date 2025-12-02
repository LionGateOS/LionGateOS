import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { SoundEngine } from "./system/SoundEngine";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  SoundEngine.playBoot();
  root.render(<App />);
}
