import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export function DetailDrawer({ isOpen, title, onClose, children, }) {
    React.useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        if (isOpen)
            window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "to-drawer-wrap", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "to-drawer-backdrop", onClick: onClose }), _jsxs("aside", { className: "to-drawer", children: [_jsxs("div", { className: "to-drawer-head", children: [_jsx("div", { className: "to-drawer-title", children: title }), _jsx("button", { className: "to-ghost-btn", type: "button", onClick: onClose, children: "Close" })] }), _jsx("div", { className: "to-drawer-body", children: children })] })] }));
}
