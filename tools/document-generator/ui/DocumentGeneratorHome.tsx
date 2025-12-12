import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "../../../components/Button";

export const DocumentGeneratorHome: React.FC = () => {
  const [title] = useState("Smart Quote / Estimate");
  const [body] = useState(
    "This is a placeholder document. In future steps it will be generated directly from your estimator line items, presets, and client profile."
  );

  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.55)",
        padding: 14,
        background:
          "radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.98))"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FileText size={18} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 550 }}>Document Generator</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>
            Minimal prototype wired into the OS shell. Later this will output
            polished PDFs and branded documents.
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 12,
          border: "1px dashed rgba(148,163,184,0.6)",
          background:
            "radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.99))"
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 550, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>{body}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        <Button variant="primary">
          <Download size={14} />
          Export (placeholder)
        </Button>
      </div>
    </div>
  );
};
