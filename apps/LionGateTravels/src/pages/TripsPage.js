import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import { uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
const STATUSES = ["Confirmed", "Quote sent", "Deposit due", "Cancelled"];
export const TripsPage = ({ state, setState }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const matches = (obj) => !q || JSON.stringify(obj).toLowerCase().includes(q);
    const selected = useMemo(() => selectedId ? state.trips.find(t => t.id === selectedId) ?? null : null, [selectedId, state]);
    const [traveller, setTraveller] = useState("");
    const [status, setStatus] = useState("Confirmed");
    const [notes, setNotes] = useState("");
    const dirty = selected ? (notes !== (selected.notes ?? "") || status !== selected.status) : traveller !== "";
    React.useEffect(() => { if (selected) {
        setNotes(selected.notes ?? "");
        setStatus(selected.status);
    } }, [selected]);
    const create = () => {
        pushUndo(state);
        setState({ ...state, trips: [...state.trips, { id: uid("trip"), traveller: traveller || "New traveller", destination: "—", dates: "—", status, notes }] });
        setTraveller("");
        setNotes("");
        setStatus("Confirmed");
    };
    const save = () => {
        if (!selected)
            return;
        pushUndo(state);
        setState({ ...state, trips: state.trips.map(t => t.id === selected.id ? { ...t, status, notes } : t) });
    };
    return (_jsx("main", { className: "to-dashboard", children: _jsxs("section", { className: "to-section", children: [_jsx("h1", { className: "to-h1", children: "Trips" }), _jsx("div", { className: "to-searchbar", children: _jsx("input", { className: "to-input", placeholder: "Search trips\u2026", value: query, onChange: e => setQuery(e.target.value) }) }), _jsxs("div", { className: "to-table-card", children: [_jsxs("div", { className: "to-table-header", children: [_jsx("span", { children: "Traveller" }), _jsx("span", { children: "Destination" }), _jsx("span", { children: "Dates" }), _jsx("span", { children: "Status" })] }), state.trips.filter(matches).map(t => (_jsxs("div", { className: "to-table-row to-table-row-clickable" + (t.id === selectedId ? " to-table-row-selected" : ""), onClick: () => setSelectedId(t.id), children: [_jsx("span", { children: t.traveller }), _jsx("span", { children: t.destination }), _jsx("span", { children: t.dates }), _jsx("span", { className: "to-pill-slim", children: t.status })] }, t.id)))] }), _jsx(DetailDrawer, { isOpen: !!selectedId, title: selected ? selected.traveller : "New Trip", dirty: dirty, onClose: () => setSelectedId(null), children: !selected ? (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Traveller" }), _jsx("input", { className: "to-input", value: traveller, onChange: e => setTraveller(e.target.value) })] }), _jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Status" }), _jsx("select", { className: "to-input", value: status, onChange: e => setStatus(e.target.value), children: STATUSES.map(s => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: create, children: "Create" }) })] })) : (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Status" }), _jsx("select", { className: "to-input", value: status, onChange: e => setStatus(e.target.value), children: STATUSES.map(s => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: save, children: "Save" }) })] })) })] }) }));
};
