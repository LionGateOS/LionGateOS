import React, { useEffect, useRef } from "react";

interface WheelSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;

  /**
   * Optional LionGateOS override.
   * If undefined, we default to wheel for now (temporary UX choice).
   */
  lionGateInteractionMode?: "wheel" | "slider";
}

const ITEM_HEIGHT = 48;

export const WheelSelect: React.FC<WheelSelectProps> = ({
  label,
  value,
  options,
  onChange,
  lionGateInteractionMode
}) => {
  const mode = lionGateInteractionMode ?? "wheel";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "wheel") return;
    const idx = options.indexOf(value);
    if (idx >= 0 && ref.current) {
      ref.current.scrollTop = idx * ITEM_HEIGHT;
    }
  }, [mode, value, options]);

  const handleScroll = () => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
    const v = options[idx];
    if (v && v !== value) onChange(v);
  };

  if (mode === "slider") {
    const idx = Math.max(0, options.indexOf(value));
    return (
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>{label}</label>
        <input
          type="range"
          min={0}
          max={options.length - 1}
          step={1}
          value={idx}
          onChange={(e) => {
            const v = options[Number(e.target.value)];
            if (v) onChange(v);
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>{label}</label>
      <div
        style={{
          position: "relative",
          height: ITEM_HEIGHT * 5,
          borderRadius: 18,
          background: "var(--surface-02)",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT * 2,
            background: "linear-gradient(to bottom, var(--surface-02), rgba(0,0,0,0))",
            zIndex: 2
          }}
        />
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT * 2,
            background: "linear-gradient(to top, var(--surface-02), rgba(0,0,0,0))",
            zIndex: 2
          }}
        />
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            left: 8,
            right: 8,
            height: ITEM_HEIGHT,
            transform: "translateY(-50%)",
            borderRadius: 14,
            border: "1px solid var(--border-strong)",
            background: "var(--surface-glass)",
            zIndex: 3
          }}
        />
        <div
          ref={ref}
          onScroll={handleScroll}
          style={{
            height: "100%",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            scrollbarWidth: "none"
          }}
        >
          <div style={{ height: ITEM_HEIGHT * 2 }} />
          {options.map((opt) => (
            <div
              key={opt}
              style={{
                height: ITEM_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "center",
                fontWeight: opt === value ? 700 : 400,
                opacity: opt === value ? 1 : 0.6
              }}
            >
              {opt}
            </div>
          ))}
          <div style={{ height: ITEM_HEIGHT * 2 }} />
        </div>
      </div>
    </div>
  );
};
