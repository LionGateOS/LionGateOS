import React from "react";
import { AppShellWrapper } from "./system/AppShellWrapper";

/**
 * This is an auto-generated safe wrapper for your existing App component.
 * It preserves your full UI and only activates the LionGateOS shell view
 * when window.LGOS_SHELL_MODE === true.
 */

const App = () => {
  return (
    <AppShellWrapper>
      <div style={{ padding: 20, color: "#fff" }}>
        <h1>Your current UI runs here.</h1>
        <p>
          The LionGateOS Shell Preview is available. To activate it, open
          the browser console and set:
        </p>
        <pre
          style={{
            background: "#111",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "10px"
          }}
        >
          window.LGOS_SHELL_MODE = true
        </pre>
        <p>Then reload the browser.</p>
      </div>
    </AppShellWrapper>
  );
};

export default App;
