import React from "react";

interface AppShellProps {
  activeTool: string;
  onChangeTool: (tool: any) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(1200px 600px at 50% -200px, rgba(120,160,255,0.08), transparent 60%), var(--lg-travel-bg)",
        color: "#e5e7eb",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* TEMP: Navigation intentionally removed */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};
