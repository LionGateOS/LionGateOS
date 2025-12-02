import React from "react";
import { useThemeEngine } from "../../theme/provider/ThemeProvider";

export const ThemePanel: React.FC = () => {
  const { styleMode, meta } = useThemeEngine();
  const anyMeta: any = meta as any;
  const styleMeta = anyMeta?.styleModes?.[styleMode] ?? null;

  const label: string = styleMeta?.label ?? styleMode ?? "Theme";
  const description: string =
    styleMeta?.description ?? "Active LionGateOS theme.";
  const primary =
    styleMeta?.colors?.primary ?? styleMeta?.preview?.primaryColor ?? "#4b8bff";
  const accent =
    styleMeta?.colors?.accent ?? styleMeta?.preview?.accentColor ?? "#8b5bfd";
  const surface =
    styleMeta?.colors?.surface ?? styleMeta?.preview?.surfaceColor ?? "#0f172a";
  const textColor =
    styleMeta?.colors?.text ?? styleMeta?.preview?.textColor ?? "#f9fafb";

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: 4 }}>{label}</h2>
      <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.8 }}>{description}</p>

      <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
        <div>
          <p style={{ opacity: 0.7, fontSize: 12, marginBottom: 4 }}>Primary</p>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              backgroundColor: primary,
            }}
          />
        </div>
        <div>
          <p style={{ opacity: 0.7, fontSize: 12, marginBottom: 4 }}>Accent</p>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              backgroundColor: accent,
            }}
          />
        </div>
        <div>
          <p style={{ opacity: 0.7, fontSize: 12, marginBottom: 4 }}>Surface</p>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              backgroundColor: surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: textColor,
              fontSize: 11,
            }}
          >
            Aa
          </div>
        </div>
      </div>
    </div>
  );
};
