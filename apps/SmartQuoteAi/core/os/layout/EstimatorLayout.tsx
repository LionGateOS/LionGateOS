import React from "react";

export default function EstimatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(1200px 600px at 50% -200px, rgba(120,160,255,0.08), transparent 60%), #0b1020",
        padding: "32px 40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
