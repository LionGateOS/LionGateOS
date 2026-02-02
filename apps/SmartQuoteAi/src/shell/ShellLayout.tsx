import React from "react";
import SparklesLayer from "./SparklesLayer";
import "./shell.css";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell-root">
      <div className="shell-background" />
      <SparklesLayer />
      <div className="shell-content">
        {children}
      </div>
    </div>
  );
}
