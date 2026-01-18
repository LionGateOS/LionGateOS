
import { useEffect } from "react";

export default function ShellParticles() {
  useEffect(() => {
    // @ts-ignore
    if (window.ParticleLayer) {
      // @ts-ignore
      new window.ParticleLayer(document.body, 140, false);
    }
  }, []);

  return <div className="shell-particles" />;
}
