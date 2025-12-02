import React from "react";
import { useTokens } from "../theme/hooks/useTokens";
import { useStyleMode } from "../theme/hooks/useStyleMode";

export const ThemeEnginePanel: React.FC = () => {
  const tokens = useTokens();
  const { styleMode, setStyleMode, modes } = useStyleMode();

  const background = (tokens as any).backgroundSurface || "#020617";
  const textPrimary = (tokens as any).textPrimary || "#e5e7eb";
  const textMuted = (tokens as any).textMuted || "#9ca3af";

  return (
    <div
      style={{
        padding: 32,
        background,
        minHeight: "100%",
        color: textPrimary,
      }}
    >
      <h1 style={{ margin: "0 0 16px 0", fontSize: 24 }}>Theme Engine</h1>

      <p style={{ margin: "0 0 24px 0", color: textMuted, maxWidth: 520 }}>
        This panel is the skeleton UI for the LionGateOS Theme Engine. You
        can switch style modes and inspect the active token set. Future
        phases will connect these tokens to the full shell layout and
        branding tools.
      </p>

      <label style={{ display: "block", marginBottom: 8 }}>
        Style mode
      </label>
      <select
        value={styleMode}
        onChange={(e) => setStyleMode(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: 999,
          border: "1px solid rgba(148,163,184,0.4)",
          background,
          color: textPrimary,
          minWidth: 260,
        }}
      >
        {modes.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Active tokens</h3>
        <pre
          style={{
            background: "#020617",
            padding: 16,
            borderRadius: 12,
            fontSize: 12,
            overflow: "auto",
            maxHeight: 320,
          }}
        >
          {JSON.stringify(tokens, null, 2)}
        </pre>
      </div>
    </div>
  );
};
