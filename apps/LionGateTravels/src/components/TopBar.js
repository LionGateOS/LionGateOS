import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
export const TopBar = ({ onUndo }) => {
    const loc = useLocation();
    const titleMap = {
        "/": "Overview", "/trips": "Trips", "/quotes": "Quotes", "/clients": "Clients", "/tasks": "Tasks", "/settings": "Settings"
    };
    return (_jsxs("header", { className: "to-topbar", children: [_jsx("div", { className: "to-topbar-title", children: titleMap[loc.pathname] ?? "Travel workspace" }), _jsxs("div", { className: "to-topbar-right", children: [_jsx("span", { className: "to-pill to-pill-green", children: "ONLINE" }), onUndo && _jsx("button", { className: "to-ghost-btn", onClick: onUndo, children: "Undo" })] })] }));
};
