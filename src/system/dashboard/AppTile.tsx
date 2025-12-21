import React from "react";
import type { AppRegistration } from "../appRegistry";

export type AppStatus = "Idle" | "Active" | "Needs attention";

export default function AppTile({
  app,
  status,
  onOpen,
}: {
  app: AppRegistration;
  status: AppStatus;
  onOpen: () => void;
}): JSX.Element {
  const isActive = status === "Active";
  const isAttention = status === "Needs attention";

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 132,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            fontSize: 18,
          }}
        >
          {app.icon}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ color: "rgba(255,255,255,0.92)", fontWeight: 700, fontSize: 14 }}>
            {app.name}
          </div>
          <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 12, marginTop: 2 }}>
            {app.description}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: "auto" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.10)",
            background: isActive
              ? "rgba(88,166,255,0.14)"
              : isAttention
                ? "rgba(255,180,70,0.12)"
                : "rgba(255,255,255,0.03)",
            color: "rgba(255,255,255,0.78)",
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: isActive ? "rgba(88,166,255,1)" : "rgba(255,255,255,0.28)",
              boxShadow: isActive ? "0 0 10px rgba(88,166,255,0.35)" : "none",
            }}
          />
          {status}
        </div>

        <button
          type="button"
          onClick={onOpen}
          style={{
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.92)",
            padding: "8px 10px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Open
        </button>
      </div>
    </div>
  );
}
