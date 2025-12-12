import React, { useEffect, useRef, useState } from "react";
import "./splash.css";

type CinematicSplashProps = {
  onDone: () => void;
  fadeOutMs?: number;
};

const VIDEO_FAIL_SAFE = 6000; // 6s safety timeout

const CinematicSplash: React.FC<CinematicSplashProps> = ({ onDone, fadeOutMs = 600 }) => {
  const hasCompletedRef = useRef(false);
  const [fadeVisible, setFadeVisible] = useState(false);

  const complete = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setFadeVisible(true);
    setTimeout(() => {
      onDone();
    }, fadeOutMs + 50);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      complete();
    }, VIDEO_FAIL_SAFE);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="lgos-splash-root">
        <div className="lgos-splash-video-frame">
          <div className="lgos-splash-video-inner">
            <video
              className="lgos-splash-video"
              src="/branding/animation/splash/splash.mp4"
              autoPlay
              muted
              playsInline
              onEnded={complete}
            />
          </div>
        </div>
      </div>
      <div
        className={
          "lgos-splash-fade-layer" +
          (fadeVisible ? " lgos-splash-fade-layer--visible" : "")
        }
      />
    </>
  );
};

export default CinematicSplash;