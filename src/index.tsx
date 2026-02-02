import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Global/theme CSS (keep paths consistent with your repo)
import "./styles/globals.css";
import "./theme/os-theme.css";

import BootErrorBoundary from "./components/BootErrorBoundary";
import App from "./App";

/**
 * LionGateOS boot:
 * - Guarantees a root element exists
 * - Wraps the app in a Router so any <Routes/> / useRoutes() usage is valid
 * - Keeps BootErrorBoundary as the last-resort UI crash shield
 */
function ensureRootEl(): HTMLElement {
  const byId = (id: string) => document.getElementById(id) as HTMLElement | null;
  let el = byId("root") || byId("app") || byId("liongate-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "root";
    document.body.appendChild(el);
  }

  // Defensive defaults (helps avoid "blank white page" when CSS isn't loaded)
  document.documentElement.style.height ||= "100%";
  document.body.style.height ||= "100%";
  document.body.style.margin ||= "0";

  return el;
}

function renderImportFailure(err: unknown) {
  const root = ensureRootEl();
  root.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.style.padding = "24px";
  wrap.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  wrap.style.color = "#fff";
  wrap.style.background = "radial-gradient(900px 600px at 30% 20%, rgba(75,122,255,0.22), rgba(0,0,0,0.86))";
  wrap.style.minHeight = "100vh";
  wrap.innerHTML = `
    <h2 style="margin:0 0 8px 0;">LionGateOS — Boot Error</h2>
    <p style="margin:0 0 12px 0; opacity:0.9;">
      The app failed during initial import. Open DevTools Console for details.
    </p>
    <pre style="white-space:pre-wrap; opacity:0.85; background:rgba(255,255,255,0.06); padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.14); overflow:auto;">${
      String((err as any)?.stack || err)
    }</pre>
  `;
  root.appendChild(wrap);
}

function boot() {
  try {
    const root = ReactDOM.createRoot(ensureRootEl());
    root.render(
      <React.StrictMode>
        <BootErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BootErrorBoundary>
      </React.StrictMode>
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("LionGateOS boot failed:", e);
    renderImportFailure(e);
  }
}

boot();
