import React from "react";
import { BackupManager } from "../../../components/BackupManager";

export const BusinessPage: React.FC = () => {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Business Tools</h2>
      <p style={{ fontSize: 13, opacity: 0.85 }}>
        Consolidated home for backups and, later, scheduling, jobs, payroll, and
        profitability controls.
      </p>
      <div style={{ marginTop: 12 }}>
        <BackupManager />
      </div>
    </>
  );
};
