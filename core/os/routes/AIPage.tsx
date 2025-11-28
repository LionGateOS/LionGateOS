import React from "react";

export const AIPage: React.FC = () => {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>AI Workspace (Planned)</h2>
      <p style={{ fontSize: 13, opacity: 0.85 }}>
        This area will host your safety assistant, code inspector, and
        camera-based estimator. For now it is just a placeholder in the shell.
      </p>
      <ul style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>
        <li>AI Safety & Green Book helper</li>
        <li>AI Building Code & Inspection flows</li>
        <li>Camera / video-based quantity extraction</li>
      </ul>
    </>
  );
};
