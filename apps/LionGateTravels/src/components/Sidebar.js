import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
const navItems = [
    { path: "/", label: "Overview" },
    { path: "/trips", label: "Trips" },
    { path: "/quotes", label: "Quotes" },
    { path: "/clients", label: "Clients" },
    { path: "/tasks", label: "Tasks" },
    { path: "/settings", label: "Settings" }
];
export const Sidebar = () => (_jsxs("aside", { className: "to-sidebar", children: [_jsx("div", { className: "to-logo", children: "TravelOrchestrator" }), _jsx("nav", { children: navItems.map(i => (_jsx(NavLink, { to: i.path, end: i.path === "/", className: ({ isActive }) => "to-nav-item" + (isActive ? " to-nav-item-active" : ""), children: i.label }, i.path))) })] }));
