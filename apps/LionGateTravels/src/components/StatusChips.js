import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const StatusChips = ({ chips, active, onToggle, onClear }) => {
    const any = active.size > 0;
    return (_jsxs("div", { className: "to-chips", children: [chips.map(c => (_jsx("button", { className: "to-chip" + (active.has(c.key) ? " to-chip-active" : ""), onClick: () => onToggle(c.key), type: "button", children: c.label }, c.key))), any ? (_jsx("button", { className: "to-chip-clear", onClick: onClear, type: "button", children: "Clear" })) : null] }));
};
