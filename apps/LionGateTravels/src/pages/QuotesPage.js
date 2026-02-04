import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import { uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
const STATUSES = ["Draft", "Waiting reply", "Sent", "Accepted"];
export const QuotesPage = ({ state, setState }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const matches = (obj) => !q || JSON.stringify(obj).toLowerCase().includes(q);
    const selected = useMemo(() => selectedId ? state.quotes.find(q => q.id === selectedId) ?? null : null, [selectedId, state]);
    const [reference, setReference] = useState("");
    const [status, setStatus] = useState("Draft");
    const [notes, setNotes] = useState("");
    const dirty = selected ? (notes !== (selected.notes ?? "") || status !== selected.status) : reference !== "";
    React.useEffect(() => { if (selected) {
        setNotes(selected.notes ?? "");
        setStatus(selected.status);
    } }, [selected]);
    const create = () => { pushUndo(state); setState({ ...state, quotes: [...state.quotes, { id: uid("quote"), reference: reference || "Q-NEW", traveller: "—", destination: "—", value: "—", status, notes }] }); };
    const save = () => { if (!selected)
        return; pushUndo(state); setState({ ...state, quotes: state.quotes.map(q => q.id === selected.id ? { ...q, status, notes } : q) }); };
    return (_jsx("main", { className: "to-dashboard", children: _jsxs("section", { className: "to-section", children: [_jsx("h1", { className: "to-h1", children: "Quotes" }), _jsx("div", { className: "to-searchbar", children: _jsx("input", { className: "to-input", placeholder: "Search quotes\u2026", value: query, onChange: e => setQuery(e.target.value) }) }), _jsxs("div", { className: "to-table-card", children: [_jsxs("div", { className: "to-table-header to-table-header-5", children: [_jsx("span", { children: "Ref" }), _jsx("span", { children: "Traveller" }), _jsx("span", { children: "Destination" }), _jsx("span", { children: "Value" }), _jsx("span", { children: "Status" })] }), state.quotes.filter(matches).map(q => (_jsxs("div", { className: "to-table-row to-table-row-5 to-table-row-clickable" + (q.id === selectedId ? " to-table-row-selected" : ""), onClick: () => setSelectedId(q.id), children: [_jsx("span", { children: q.reference }), _jsx("span", { children: q.traveller }), _jsx("span", { children: q.destination }), _jsx("span", { children: q.value }), _jsx("span", { className: "to-pill-slim", children: q.status })] }, q.id)))] }), _jsx(DetailDrawer, { isOpen: !!selectedId, title: selected ? selected.reference : "New Quote", dirty: dirty, onClose: () => setSelectedId(null), children: !selected ? (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Reference" }), _jsx("input", { className: "to-input", value: reference, onChange: e => setReference(e.target.value) })] }), _jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Status" }), _jsx("select", { className: "to-input", value: status, onChange: e => setStatus(e.target.value), children: STATUSES.map(s => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: create, children: "Create" }) })] })) : (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Status" }), _jsx("select", { className: "to-input", value: status, onChange: e => setStatus(e.target.value), children: STATUSES.map(s => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: save, children: "Save" }) })] })) })] }) }));
};
