import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
function formatMoney(n) {
    try {
        return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    catch {
        return String(n);
    }
}
export default function Overview(_props) {
    const [mode, setMode] = React.useState("intake");
    const [bookingRef, setBookingRef] = React.useState("");
    const [vendor, setVendor] = React.useState("");
    const [status, setStatus] = React.useState("Booked");
    const [price] = React.useState(() => Math.floor(600 + Math.random() * 1400));
    const [action, setAction] = React.useState("cancel");
    const [feedback, setFeedback] = React.useState(null);
    const goOverview = () => {
        setFeedback(null);
        setMode("overview");
    };
    const start = () => {
        const v = vendor.trim();
        if (!v) {
            alert("Just add an airline or hotel to continue.");
            return;
        }
        setStatus("Booked");
        goOverview();
    };
    const openAction = (k) => {
        setAction(k);
        setMode("action");
    };
    const applyRecommended = () => {
        if (action === "cancel")
            setStatus("Cancelled");
        if (action === "change")
            setStatus("Changed");
        if (action === "issue")
            setStatus("Issue reported");
        setMode("confirm");
    };
    const applyAlternative = () => {
        setMode("confirm");
    };
    const reset = () => {
        setBookingRef("");
        setVendor("");
        setStatus("Booked");
        setFeedback(null);
        setMode("intake");
    };
    const actionTitle = action === "cancel" ? "Cancel trip" :
        action === "change" ? "Change trip" :
            "Something went wrong";
    const actionText = action === "cancel"
        ? "Recommended will cancel the trip in Test Mode. Alternative keeps it booked."
        : action === "change"
            ? "Recommended will mark the trip as changed in Test Mode. Alternative leaves it unchanged."
            : "Recommended will file an issue in Test Mode. Alternative takes no action.";
    return (_jsx("main", { className: "to-dashboard", children: _jsxs("section", { className: "to-section", children: [_jsx("div", { className: "to-card", style: { padding: 14, borderRadius: 14 }, children: _jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }, children: [_jsxs("div", { children: [_jsx("div", { className: "to-h1", style: { margin: 0 }, children: "LionGate Travels" }), _jsx("div", { className: "to-muted", style: { marginTop: 4 }, children: "Test Mode \u2014 No real bookings or payments" })] }), _jsx("button", { className: "to-ghost-btn", type: "button", onClick: reset, children: "Start over" })] }) }), _jsxs("div", { className: "to-card", style: { padding: 16, borderRadius: 14, marginTop: 14 }, children: [_jsx("h2", { className: "to-h2", style: { marginTop: 0 }, children: "How this works" }), _jsxs("div", { className: "to-muted", style: { maxWidth: 720 }, children: ["LionGate Travels helps you review travel details and then continues your booking or changes on the airline or hotel\u2019s website.", _jsx("br", {}), _jsx("br", {}), "We do not process payments, manage reservations, or provide booking support."] })] }), mode === "intake" && (_jsxs("div", { className: "to-card", style: { padding: 16, borderRadius: 14, marginTop: 14 }, children: [_jsx("h1", { className: "to-h1", children: "Tell me about your trip" }), _jsxs("div", { className: "to-grid", style: { display: "grid", gridTemplateColumns: "1fr", gap: 12, maxWidth: 520 }, children: [_jsxs("div", { children: [_jsx("div", { className: "to-k", children: "Booking reference (optional)" }), _jsx("input", { className: "to-input", value: bookingRef, onChange: (e) => setBookingRef(e.target.value), placeholder: "e.g., ABC123" })] }), _jsxs("div", { children: [_jsx("div", { className: "to-k", children: "Airline or hotel" }), _jsx("input", { className: "to-input", value: vendor, onChange: (e) => setVendor(e.target.value), placeholder: "e.g., Delta / Marriott" })] }), _jsx("div", { children: _jsx("button", { className: "to-primary-btn", type: "button", onClick: start, children: "Continue" }) })] })] })), mode === "overview" && (_jsxs("div", { className: "to-card", style: { padding: 16, borderRadius: 14, marginTop: 14 }, children: [_jsx("h1", { className: "to-h1", children: "Trip Overview" }), _jsxs("div", { className: "to-muted", style: { marginTop: 6 }, children: ["Vendor: ", _jsx("strong", { children: vendor.trim() })] }), _jsxs("div", { className: "to-muted", children: ["Reference: ", _jsx("strong", { children: bookingRef.trim() || "—" })] }), _jsx("div", { style: { marginTop: 10 }, children: _jsx("span", { className: "to-pill-slim", children: status }) }), _jsxs("div", { style: { fontSize: 22, fontWeight: 700, marginTop: 10 }, children: ["$", formatMoney(price), " ", _jsx("span", { className: "to-pill-slim", style: { marginLeft: 8 }, children: "Test price" })] }), _jsx("h2", { className: "to-h2", style: { marginTop: 18 }, children: "What do you need help with?" }), _jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [_jsx("button", { className: "to-danger-btn", type: "button", onClick: () => openAction("cancel"), children: "Cancel trip" }), _jsx("button", { className: "to-secondary-btn", type: "button", onClick: () => openAction("change"), children: "Change trip" }), _jsx("button", { className: "to-secondary-btn", type: "button", onClick: () => openAction("issue"), children: "Something went wrong" })] })] })), mode === "action" && (_jsxs("div", { className: "to-card", style: { padding: 16, borderRadius: 14, marginTop: 14 }, children: [_jsx("h1", { className: "to-h1", children: actionTitle }), _jsx("div", { className: "to-muted", style: { maxWidth: 660 }, children: actionText }), _jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }, children: [_jsx("button", { className: "to-primary-btn", type: "button", onClick: applyRecommended, children: "Recommended" }), _jsx("button", { className: "to-secondary-btn", type: "button", onClick: applyAlternative, children: "Alternative" }), _jsx("button", { className: "to-ghost-btn", type: "button", onClick: goOverview, children: "Back" })] })] })), mode === "confirm" && (_jsxs("div", { className: "to-card", style: { padding: 16, borderRadius: 14, marginTop: 14 }, children: [_jsx("h1", { className: "to-h1", children: "I handled this for you." }), _jsxs("div", { className: "to-muted", style: { marginTop: 6 }, children: ["Status: ", _jsx("strong", { children: status })] }), _jsx("div", { className: "to-muted", children: "All systems are running normally." }), _jsx("h2", { className: "to-h2", style: { marginTop: 18 }, children: "Was this easy to do?" }), _jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [_jsx("button", { className: "to-primary-btn", type: "button", onClick: () => setFeedback("Yes"), children: "Yes" }), _jsx("button", { className: "to-secondary-btn", type: "button", onClick: () => setFeedback("No"), children: "No" }), _jsx("button", { className: "to-ghost-btn", type: "button", onClick: goOverview, children: "Back to trip" })] }), feedback && (_jsxs("div", { className: "to-muted", style: { marginTop: 10 }, children: ["Feedback recorded: ", feedback] }))] }))] }) }));
}
