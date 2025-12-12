import React from "react";
import { useThemeEngine } from "../../theme/provider/ThemeProvider";

export const ThemeSidebarPalette: React.FC = () => {
  const { styleMode, meta } = useThemeEngine();
  const anyMeta: any = meta as any;
  const styleMeta = anyMeta?.styleModes?.[styleMode] ?? null;

  const primary =
    styleMeta?.colors?.primary ?? styleMeta?.preview?.primaryColor ?? "#4b8bff";
  const accent =
    styleMeta?.colors?.accent ?? styleMeta?.preview?.accentColor ?? "#8b5bfd";
  const surface =
    styleMeta?.colors?.surface ?? styleMeta?.preview?.surfaceColor ?? "#0f172a";

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Theme</p>
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            backgroundColor: primary,
          }}
        />
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            backgroundColor: accent,
          }}
        />
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            backgroundColor: surface,
          }}
        />
      </div>
    </div>
  );
};
