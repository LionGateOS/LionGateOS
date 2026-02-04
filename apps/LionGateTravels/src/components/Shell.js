import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
const NAV = [
    { to: "/", label: "Start" },
    { to: "/trips", label: "Trips" },
    { to: "/quotes", label: "Quotes" },
    { to: "/clients", label: "Clients" },
    { to: "/tasks", label: "Tasks" },
];
export function Shell({ children }) {
    const loc = useLocation();
    return (_jsxs("div", { className: "to-shell", children: [_jsxs("aside", { className: "to-sidebar", children: [_jsxs("div", { className: "to-brand", children: [_jsx("div", { className: "to-brand-mark", "aria-hidden": "true" }), _jsxs("div", { className: "to-brand-text", children: [_jsx("div", { className: "to-brand-title", children: "LionGate Travels" }), _jsx("div", { className: "to-brand-sub", children: "Test Mode" })] })] }), _jsx("nav", { className: "to-nav", "aria-label": "Primary", children: NAV.map((n) => {
                            const active = loc.pathname === n.to;
                            return (_jsx(Link, { to: n.to, className: "to-nav-item" + (active ? " to-nav-item-active" : ""), children: n.label }, n.to));
                        }) }), _jsxs("div", { className: "to-sidebar-footer", children: [_jsx("span", { className: "to-status-dot", "aria-hidden": "true" }), _jsx("span", { className: "to-status-text", children: "ONLINE" })] })] }), _jsxs("div", { className: "to-content", children: [_jsxs("header", { className: "to-topbar", children: [_jsx("div", { className: "to-topbar-title", children: "LionGate Travels" }), _jsx("div", { className: "to-topbar-right", children: _jsx("button", { className: "to-ghost-btn", type: "button", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }), children: "Back to top" }) })] }), _jsx("div", { className: "to-content-inner", children: children })] })] }));
}
