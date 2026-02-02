import React, { useEffect, useRef } from "react";

type Tier = "desktop" | "mobile" | "low";

function getTier(): Tier {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mem = (navigator as any).deviceMemory || 0;
  const cores = navigator.hardwareConcurrency || 0;
  const small = Math.min(window.innerWidth, window.innerHeight) < 768;

  if (prefersReduced) return "mobile"; // slow, not off
  if (mem && mem <= 2) return "low";   // fewer, not zero
  if (cores && cores <= 2) return "low";
  if (small) return "mobile";
  return "desktop";
}

export default function SparklesLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let tier = getTier();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const counts = {
      desktop: 64,
      mobile: 36,
      low: 18
    };

    const speeds = {
      desktop: 0.35,
      mobile: 0.25,
      low: 0.18
    };

    const sparkleCount = counts[tier];
    const baseSpeed = speeds[tier];

    const sparkles = Array.from({ length: sparkleCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 2.5 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.05,
      vy: baseSpeed + Math.random() * 0.25,
      a: 0.45 + Math.random() * 0.35
    }));

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of sparkles) {
        s.y -= s.vy;
        s.x += s.vx;

        if (s.y < -10) {
          s.y = window.innerHeight + 10;
          s.x = Math.random() * window.innerWidth;
        }
        if (s.x < -10) s.x = window.innerWidth + 10;
        if (s.x > window.innerWidth + 10) s.x = -10;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,247,255,${s.a})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2
      }}
    />
  );
}
