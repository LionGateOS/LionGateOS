import React from "react";
import { useTokens } from "../theme/hooks/useTokens";
import { useStyleMode } from "../theme/hooks/useStyleMode";

export const ThemeEnginePanel = () => {
  const tokens = useTokens();
  const { styleMode, setStyleMode, modes } = useStyleMode();

  return (
    <div style={{ padding: 32, color: tokens.textPrimary }}>
      <h1 style={{ marginBottom: 20 }}>Theme Engine</h1>

      <p style={{ marginBottom: 20, color: tokens.textMuted }}>
        Select a style mode to preview dynamic theming.
      </p>

      <select
        value={styleMode}
        onChange={e => setStyleMode(e.target.value)}
        style={{
          padding: 12,
          borderRadius: 6,
          background: tokens.backgroundSurface,
          color: tokens.textPrimary,
        }}
      >
        {modes.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <div style={{ marginTop: 30 }}>
        <h3>Active Tokens</h3>
        <pre style={{ background: "#0a0f1e", padding: 16, borderRadius: 8 }}>
        {JSON.stringify(tokens, null, 2)}
        </pre>
      </div>
    </div>
  );
};