import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const cards = [
    { label: "Active trips", value: "7" },
    { label: "Quotes awaiting reply", value: "3" },
    { label: "Tasks due today", value: "5" },
    { label: "Clients travelling now", value: "2" }
];
export const Dashboard = () => {
    return (_jsxs("main", { className: "to-dashboard", children: [_jsxs("section", { className: "to-section", children: [_jsx("h1", { className: "to-h1", children: "Today's cockpit" }), _jsx("p", { className: "to-muted", children: "A single place to see what needs your attention across all travellers, quotes and suppliers." }), _jsx("div", { className: "to-grid", children: cards.map((card) => (_jsxs("article", { className: "to-card", children: [_jsx("div", { className: "to-card-value", children: card.value }), _jsx("div", { className: "to-card-label", children: card.label })] }, card.label))) })] }), _jsxs("section", { className: "to-section", children: [_jsx("h2", { className: "to-h2", children: "Next actions" }), _jsxs("ul", { className: "to-list", children: [_jsx("li", { children: "Call supplier to confirm airport transfer times." }), _jsx("li", { children: "Send updated quote for Lisbon city break." }), _jsx("li", { children: "Check-in reminder for tomorrow's departures." })] })] })] }));
};
