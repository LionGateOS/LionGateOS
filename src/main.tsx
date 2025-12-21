import React from "react";
import ReactDOM from "react-dom/client";

// Keep existing global/theme imports if present in your repo.
// If any of these files don't exist in your project, Vite will show a clear error message in the browser.
import "./styles/globals.css";
import "./theme/os-theme.css";

import BootErrorBoundary from "./components/BootErrorBoundary";

function ensureRootEl(): HTMLElement {
  const byId = (id: string) => document.getElementById(id) as HTMLElement | null;
  let el = byId("root") || byId("app") || byId("liongate-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "root";
    document.body.appendChild(el);
  }
  return el;
}

function renderImportFailure(error: unknown) {
  const el = ensureRootEl();
  const msg =
    error instanceof Error
      ? `${error.name}: ${error.message}\n\n${error.stack ?? ""}`
      : String(error);

  el.innerHTML = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 16px; color: rgba(255,255,255,0.92); background: #0b1622; min-height: 100vh;">
      <div style="font-size: 16px; font-weight: 800; margin-bottom: 8px;">LionGateOS — Boot Import Error (Safe Mode)</div>
      <div style="opacity: .88; margin-bottom: 12px;">The app failed while importing modules before the UI could render. Copy the details below and send them here.</div>
      <pre style="white-space: pre-wrap; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 12px; padding: 12px; overflow:auto;">${msg
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")}</pre>
    </div>
  `;
}

async function boot() {
  const rootEl = ensureRootEl();
  const root = ReactDOM.createRoot(rootEl);

  try {
    const mod = await import("./App");
    const App = mod.default;

    root.render(
      <React.StrictMode>
        <BootErrorBoundary>
          <App />
        </BootErrorBoundary>
      </React.StrictMode>
    );
  } catch (e) {
    // Import graph failed (common cause of "blank screen").
    // eslint-disable-next-line no-console
    console.error("LionGateOS boot import failed:", e);
    renderImportFailure(e);
  }
}

boot();
