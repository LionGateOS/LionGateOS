import React, { useEffect } from "react";
import "./splash.css";

type MicroSplashProps = {
  onDone: () => void;
};

const MICRO_DURATION = 1300; // 1.3s

const MicroSplash: React.FC<MicroSplashProps> = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, MICRO_DURATION);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="lgos-splash-root">
      <div className="lgos-splash-video-frame">
        <div className="lgos-splash-video-inner">
          <video
            className="lgos-splash-video"
            src="/branding/animation/splash/splash.mp4"
            autoPlay
            muted
            playsInline
          />
        </div>
      </div>
      <div className="lgos-splash-fade-layer lgos-splash-fade-layer--visible" />
    </div>
  );
};

export default MicroSplash;