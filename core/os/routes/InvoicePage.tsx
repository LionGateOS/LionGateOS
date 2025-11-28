import React from "react";
import { DocumentGeneratorHome } from "../../../tools/document-generator/ui/DocumentGeneratorHome";

export const InvoicePage: React.FC = () => {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Documents, Quotes & Invoices</h2>
      <p style={{ fontSize: 13, opacity: 0.85 }}>
        This screen hosts the document generator. In future steps it will
        connect directly to your estimates and clients.
      </p>
      <div style={{ marginTop: 12 }}>
        <DocumentGeneratorHome />
      </div>
    </>
  );
};
