import React from "react";
import { useThemeEngine } from "../../theme/provider/ThemeProvider";

export const ThemeTopbarIndicator: React.FC = () => {
  const { styleMode, meta } = useThemeEngine();
  const anyMeta: any = meta as any;
  const styleMeta = anyMeta?.styleModes?.[styleMode] ?? null;

  const label: string = styleMeta?.label ?? styleMode ?? "Theme";
  const accent =
    styleMeta?.preview?.accentColor ??
    styleMeta?.colors?.accent ??
    "#4b8bff";
  const accent2 =
    styleMeta?.preview?.accentColorAlt ??
    styleMeta?.colors?.accentAlt ??
    "#8b5bfd";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 999,
        background: `linear-gradient(135deg, ${accent}, ${accent2})`,
        color: "#ffffff",
        fontSize: 13,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "999px",
          backgroundColor: "#22c55e",
          marginRight: 2,
        }}
      />
      <span>{label}</span>
    </div>
  );
};
