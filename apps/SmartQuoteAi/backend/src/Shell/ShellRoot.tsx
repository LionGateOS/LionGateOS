
import React from "react";
import "./shell.css";
import ShellBackground from "./ShellBackground";
import ShellParticles from "./ShellParticles";

export default function ShellRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell-root">
      <ShellBackground image="/public/branding/dark-bg.png" />
      <ShellParticles />
      <div className="shell-ui">{children}</div>
    </div>
  );
}
