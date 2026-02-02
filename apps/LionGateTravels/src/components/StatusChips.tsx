import React from "react";
export type Chip = { key: string; label: string };
export const StatusChips: React.FC<{
  chips: Chip[];
  active: Set<string>;
  onToggle: (key: string) => void;
  onClear: () => void;
}> = ({ chips, active, onToggle, onClear }) => {
  const any = active.size > 0;
  return (
    <div className="to-chips">
      {chips.map(c => (
        <button
          key={c.key}
          className={"to-chip" + (active.has(c.key) ? " to-chip-active" : "")}
          onClick={() => onToggle(c.key)}
          type="button"
        >
          {c.label}
        </button>
      ))}
      {any ? (
        <button className="to-chip-clear" onClick={onClear} type="button">Clear</button>
      ) : null}
    </div>
  );
};
