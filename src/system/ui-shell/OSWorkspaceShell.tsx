import React from "react";

export const OSWorkspaceShell = ({
  osName,
  tagline,
  shellState,
  sidebar,
  children
}) => {

  const mode = shellState.styleMode || "soft-slate-os-default";
  const isSoft = mode === "soft-slate-os-default";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: isSoft
          ? "radial-gradient(circle at top left, #323a49 0%, #262d39 55%, #202630 100%)"
          : "#111",
        color: "#f7f8fc",
        fontFamily: "system-ui"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: 12,
          padding: "14px 18px",
          borderRadius: 20,
          background: "linear-gradient(135deg, #3c4657, #262d39)",
          border: "1px solid rgba(255,255,255,0.16)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 14,
              background:
                "conic-gradient(from 210deg, #e7d49c, #a38eff, #8267ff, #a38eff, #e7d49c)",
              padding: 3
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                background: "#2e3447",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "white"
              }}
            >
              LG
            </div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: "bold" }}>{osName}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{tagline}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 16,
          padding: "0 16px 16px 16px"
        }}
      >
        <div
          style={{
            borderRadius: 20,
            background: "linear-gradient(135deg, #353f52, #2e3443)",
            border: "1px solid rgba(255,255,255,0.16)",
            padding: 16
          }}
        >
          {sidebar}
        </div>

        <div
          style={{
            borderRadius: 20,
            background: "linear-gradient(145deg, #3a4254, #262d39)",
            border: "1px solid rgba(255,255,255,0.16)",
            padding: 20
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
