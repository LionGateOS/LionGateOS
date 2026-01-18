
import React, { useEffect } from "react";

export default function ShellParticles() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/js/lion_gate_os_particle_module.js";
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="lg-shell-particles" />;
}
