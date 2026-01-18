import React, { ReactNode, useEffect } from "react";
import "./shell.css";

type Props = {
  children: ReactNode;
};

export default function ShellRoot({ children }: Props) {
  useEffect(() => {
    // Ensure body never clips foreground
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="lg-shell-root">
      <div className="lg-shell-bg" />
      <canvas id="sparkCanvas" className="lg-shell-particles" />
      <div className="lg-shell-app">
        {children}
      </div>
    </div>
  );
}