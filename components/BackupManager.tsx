import React from "react";
import { Database, UploadCloud, Download } from "lucide-react";
import { Button } from "./Button";

export const BackupManager: React.FC = () => {
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
        <Database size={18} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 550 }}>Local Backup Plan</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>
            For now, zip your <code>liongateos</code> folder and push to GitHub.
            Later this will connect to cloud storage automatically.
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Button>
          <UploadCloud size={14} />
          Manual Backup Guide
        </Button>
        <Button variant="ghost">
          <Download size={14} />
          Restore Checklist
        </Button>
      </div>
    </div>
  );
};
