import React from "react";

interface Props {
  error: Error | null;
  reset: () => void;
}

export const ErrorResponse: React.FC<Props> = ({ error, reset }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)",
        color: "#f9fafb",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(12px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            background: "rgba(249, 115, 115, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            color: "#f97373",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
          System Exception Detected
        </h2>
        
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
          The module encountered an unexpected error. The LionGateOS shell remains stable, but this component needs to be reset.
        </p>

        {error && (
          <div
            style={{
              textAlign: "left",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#f97373",
              fontFamily: "monospace",
              marginBottom: "24px",
              overflow: "auto",
              maxHeight: "150px",
              border: "1px solid rgba(249, 115, 115, 0.2)",
            }}
          >
            {error.name}: {error.message}
          </div>
        )}

        <button
          onClick={reset}
          style={{
            padding: "10px 24px",
            borderRadius: "999px",
            background: "linear-gradient(to right, #4f8cff, #8b5cf6)",
            border: "none",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Reset Component
        </button>
      </div>
    </div>
  );
};
