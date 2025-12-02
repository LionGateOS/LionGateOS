
// NeonShell v2.1.1 – Dark Frosted Glass Edition
// Restores neon glow visibility and dark frosted workspace with proper blur.

import React from "react";

export const AppShellWrapper: React.FC = () => {
  const shellBackground =
    "radial-gradient(circle at top, #0b1539 0%, #050b2e 42%, #040821 100%)";

  const glow = "0 0 28px rgba(0,185,255,0.85)";
  const borderDark = "1px solid rgba(15,23,42,0.75)";

  const sidebarBg =
    "linear-gradient(180deg, #0c173f 0%, #091133 55%, #070d29 100%)";

  const topbarGradient =
    "linear-gradient(90deg, #0f3aa4 0%, #1456d6 40%, #1d7bff 100%)";

  // DARK FROSTED WORKSPACE SHEET
  const sheetBg = "rgba(12, 18, 39, 0.38)"; // deep translucent navy
  const sheetBlur = "blur(26px) saturate(170%)";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: shellBackground,
        padding: 18,
        boxSizing: "border-box",
        display: "flex",
        color: "#e5e7eb",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          padding: 20,
          marginTop: 8,
          marginBottom: 8,
          background: sidebarBg,
          borderRadius: 22,
          border: borderDark,
          boxShadow: "0 14px 32px rgba(0,0,0,0.65)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Neon spine */}
        <div
          style={{
            position: "absolute",
            inset: "12px auto 12px 0",
            width: 3,
            borderRadius: 999,
            background:
              "linear-gradient(180deg, rgba(56,189,248,0.0), rgba(56,189,248,0.85), rgba(56,189,248,0.0))",
            boxShadow: "0 0 22px rgba(56,189,248,0.85)",
          }}
        />

        {/* Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 30% 0%, #fef9c3 0%, #f97316 25%, #020617 82%)",
              border: "2px solid rgba(248,250,252,0.6)",
              boxShadow: "0 0 24px rgba(56,189,248,0.75)",
            }}
          />
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 650,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              LionGateOS
            </div>
            <div
              style={{
                fontSize: 11,
                opacity: 0.8,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Shell • Neon Core
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              opacity: 0.78,
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Navigation
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
            }}
          >
            <span>• System Overview</span>
            <span>• Workspaces</span>
            <span>• Theme Engine</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: 22,
          gap: 16,
        }}
      >
        {/* TOPBAR */}
        <header
          style={{
            height: 60,
            borderRadius: 24,
            background: topbarGradient,
            border: borderDark,
            boxShadow: glow,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 26px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 19, fontWeight: 560 }}>Workspace</div>
            <div style={{ fontSize: 12, opacity: 0.86 }}>
              Theme-aware shell frame
            </div>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
              fontSize: 12,
            }}
          >
            light-royal-glow
          </div>
        </header>

        {/* WORKSPACE */}
        <main
          style={{
            flex: 1,
            background: sheetBg,
            borderRadius: 24,
            backdropFilter: sheetBlur,
            WebkitBackdropFilter: sheetBlur,
            border: borderDark,
            boxShadow: glow,
            padding: 26,
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1480,
              margin: "18px auto 32px",
              background: "white",
              borderRadius: 22,
              border: "1px solid rgba(148,163,184,0.25)",
              padding: 28,
              color: "#020617",
              boxShadow: "0 0 22px rgba(0,185,255,0.55)",
            }}
          >
            <h2>light-royal-glow</h2>
            <p>Active LionGateOS theme.</p>
          </div>
        </main>
      </div>
    </div>
  );
};
