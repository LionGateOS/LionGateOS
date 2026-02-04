import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import { uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
export const ClientsPage = ({ state, setState }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const matches = (obj) => !q || JSON.stringify(obj).toLowerCase().includes(q);
    const selected = useMemo(() => selectedId ? state.clients.find(c => c.id === selectedId) ?? null : null, [selectedId, state]);
    const [name, setName] = useState("");
    const [segment, setSegment] = useState("Leisure");
    const [notes, setNotes] = useState("");
    const dirty = selected ? (notes !== selected.notes || segment !== selected.segment) : name !== "";
    React.useEffect(() => { if (selected) {
        setNotes(selected.notes);
        setSegment(selected.segment);
    } }, [selected]);
    const create = () => { pushUndo(state); setState({ ...state, clients: [...state.clients, { id: uid("client"), name: name || "New client", segment, notes }] }); };
    const save = () => { if (!selected)
        return; pushUndo(state); setState({ ...state, clients: state.clients.map(c => c.id === selected.id ? { ...c, segment, notes } : c) }); };
    return (_jsx("main", { className: "to-dashboard", children: _jsxs("section", { className: "to-section", children: [_jsx("h1", { className: "to-h1", children: "Clients" }), _jsx("div", { className: "to-searchbar", children: _jsx("input", { className: "to-input", placeholder: "Search clients\u2026", value: query, onChange: e => setQuery(e.target.value) }) }), _jsxs("div", { className: "to-table-card", children: [_jsxs("div", { className: "to-table-header to-table-header-3", children: [_jsx("span", { children: "Name" }), _jsx("span", { children: "Segment" }), _jsx("span", { children: "Notes" })] }), state.clients.filter(matches).map(c => (_jsxs("div", { className: "to-table-row to-table-row-3 to-table-row-clickable" + (c.id === selectedId ? " to-table-row-selected" : ""), onClick: () => setSelectedId(c.id), children: [_jsx("span", { children: c.name }), _jsx("span", { children: c.segment }), _jsx("span", { children: c.notes })] }, c.id)))] }), _jsx(DetailDrawer, { isOpen: !!selectedId, title: selected ? selected.name : "New Client", dirty: dirty, onClose: () => setSelectedId(null), children: !selected ? (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Name" }), _jsx("input", { className: "to-input", value: name, onChange: e => setName(e.target.value) })] }), _jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Segment" }), _jsx("input", { className: "to-input", value: segment, onChange: e => setSegment(e.target.value) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: create, children: "Create" }) })] })) : (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Segment" }), _jsx("input", { className: "to-input", value: segment, onChange: e => setSegment(e.target.value) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: save, children: "Save" }) })] })) })] }) }));
};
