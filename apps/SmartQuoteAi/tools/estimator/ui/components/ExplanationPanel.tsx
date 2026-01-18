import React from "react";

export type ConfidenceLevel = "HIGH" | "MED" | "LOW";

type Props = {
  confidence?: ConfidenceLevel;
  source?: string;
  explanation?: string;
  assumptions?: string[];
  exclusions?: string[];
};

/**
 * ExplanationPanel (read-only)
 * - Pure UI surface
 * - No calculation logic
 * - No OCR / extraction
 */
export const ExplanationPanel: React.FC<Props> = ({
  confidence = "MED",
  source = "Reviewed evidence",
  explanation = "This line item is based on reviewed records.",
  assumptions = [],
  exclusions = [],
}) => {
  const confStyle: Record<ConfidenceLevel, React.CSSProperties> = {
    HIGH: { background: "rgba(52,211,153,0.18)", border: "1px solid rgba(52,211,153,0.35)", color: "#d1fae5" },
    MED: { background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.30)", color: "#fde68a" },
    LOW: { background: "rgba(248,113,113,0.14)", border: "1px solid rgba(248,113,113,0.30)", color: "#fecaca" },
  };

  return (
    <section
      style={{
        padding: "14px 14px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ fontWeight: 800 }}>Why this quote is defensible</div>
        <span
          style={{
            ...confStyle[confidence],
            padding: "6px 10px",
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "12px",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          CONFIDENCE: {confidence}
        </span>
      </div>

      <div style={{ marginTop: "10px", opacity: 0.92 }}>
        <div style={{ fontWeight: 700, marginBottom: "4px" }}>Evidence</div>
        <div style={{ opacity: 0.9 }}>{source}</div>
      </div>

      <div style={{ marginTop: "10px", opacity: 0.92 }}>{explanation}</div>

      {assumptions.length > 0 && (
        <div style={{ marginTop: "12px", opacity: 0.92 }}>
          <div style={{ fontWeight: 800, marginBottom: "6px" }}>Assumptions</div>
          <div style={{ lineHeight: "1.65" }}>
            {assumptions.map((a, idx) => (
              <div key={idx}>• {a}</div>
            ))}
          </div>
        </div>
      )}

      {exclusions.length > 0 && (
        <div style={{ marginTop: "12px", opacity: 0.92 }}>
          <div style={{ fontWeight: 800, marginBottom: "6px" }}>What this does not do</div>
          <div style={{ lineHeight: "1.65" }}>
            {exclusions.map((e, idx) => (
              <div key={idx}>• {e}</div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
