import React from "react";

export const ScopePage: React.FC = () => {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Scope Builder</h2>
      <p style={{ fontSize: 13, opacity: 0.85 }}>
        This is the foundation for the Scope module. Here you will define phases,
        inclusions, exclusions and notes that stay aligned with your estimates.
        For now this is a structural placeholder as part of Build 9.
      </p>
      <div style={{ marginTop: 12, fontSize: 13, opacity: 0.85 }}>
        Future steps will add:
        <ul>
          <li>Phase & area breakdown</li>
          <li>Inclusion / exclusion templates</li>
          <li>Linking to estimator line items</li>
        </ul>
      </div>
    </>
  );
};
