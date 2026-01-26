import { useEffect, useRef } from "react";
import { getInteractionModeFromLionGateOS } from "../../visual/interactionMode";

const ITEM_HEIGHT = 56;

type WheelSelectProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

export function WheelSelect<T extends string>({ value, options, onChange }: WheelSelectProps<T>) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getInteractionModeFromLionGateOS();
  }, []);

  return (
    <div ref={ref} style={{ maxHeight: ITEM_HEIGHT * 5, overflowY: "auto" }}>
      {options.map(opt => (
        <div
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            height: ITEM_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: opt === value ? 600 : 400,
            cursor: "pointer",
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}
