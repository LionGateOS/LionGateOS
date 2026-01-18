import React from "react";
import { DocumentGeneratorHome } from "../../../tools/document-generator/ui/DocumentGeneratorHome";

export const ProposalPage: React.FC = () => {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Proposal Builder</h2>
      <p style={{ fontSize: 13, opacity: 0.85 }}>
        This module generates client-ready proposals from your estimates and presets.
        In later builds it will stay fully synced with the estimator and scope builder.
      </p>
      <div style={{ marginTop: 12 }}>
        <DocumentGeneratorHome />
      </div>
    </>
  );
};
