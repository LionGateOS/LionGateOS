import React, { useEffect, useState } from "react";
import MicroSplash from "./MicroSplash";
import CinematicSplash from "./CinematicSplash";

type SplashGateProps = {
  children: React.ReactNode;
};

type SplashMode = "none" | "micro" | "cinematic";

const VERSION_KEY = "lgos_cinematic_v2_1_2";

const SplashGate: React.FC<SplashGateProps> = ({ children }) => {
  const [mode, setMode] = useState<SplashMode>("cinematic");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VERSION_KEY);
      if (!stored) {
        setMode("cinematic");
        window.localStorage.setItem(VERSION_KEY, "1");
      } else {
        setMode("micro");
      }
    } catch {
      setMode("micro");
    }
  }, []);

  const handleDone = () => {
    setMode("none");
    setReady(true);
  };

  return (
    <>
      {mode === "cinematic" && <CinematicSplash onDone={handleDone} fadeOutMs={600} />}
      {mode === "micro" && <MicroSplash onDone={handleDone} />}
      <div style={{ visibility: ready || mode === "none" ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
};

export default SplashGate;