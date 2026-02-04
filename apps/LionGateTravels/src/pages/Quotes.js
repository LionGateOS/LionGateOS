import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
import { StatusChips } from "../components/StatusChips";
import { BulkBar } from "../components/BulkBar";
const STATUSES = ["Draft", "Sent", "Accepted", "Declined"];
export default function Quotes({ state, setState }) {
    const [query, setQuery] = React.useState("");
    const [activeChips, setActiveChips] = React.useState(new Set());
    const [sortKey, setSortKey] = React.useState(null);
    const [sortDir, setSortDir] = React.useState("asc");
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [selectedId, setSelectedId] = React.useState(null);
    const selected = selectedId ? state.quotes.find(q => q.id === selectedId) ?? null : null;
    const [reference, setReference] = React.useState("");
    const [status, setStatus] = React.useState(STATUSES[0]);
    const [notes, setNotes] = React.useState("");
    React.useEffect(() => {
        if (selected) {
            setNotes(selected.notes ?? "");
            setStatus(selected.status || STATUSES[0]);
        }
    }, [selectedId]);
    const q = query.trim().toLowerCase();
    const matchesSearch = (obj) => !q || JSON.stringify(obj).toLowerCase().includes(q);
    const matchesChips = (obj) => activeChips.size === 0 || activeChips.has(String(obj.status || STATUSES[0]));
    const filtered = React.useMemo(() => {
        return state.quotes
            .map(x => ({ ...x, status: x.status || STATUSES[0] }))
            .filter(x => matchesSearch(x) && matchesChips(x));
    }, [state.quotes, query, activeChips]);
    const sorted = React.useMemo(() => {
        const arr = [...filtered];
        if (!sortKey)
            return arr;
        const dir = sortDir === "asc" ? 1 : -1;
        arr.sort((a, b) => String(a[sortKey] ?? "").toLowerCase().localeCompare(String(b[sortKey] ?? "").toLowerCase()) * dir);
        return arr;
    }, [filtered, sortKey, sortDir]);
    React.useEffect(() => { setSelectedIds(new Set()); }, [query, activeChips]);
    React.useEffect(() => { if (selectedId && !sorted.some(x => x.id === selectedId))
        setSelectedId(null); }, [sorted]);
    const toggleChip = (k) => {
        const next = new Set(activeChips);
        next.has(k) ? next.delete(k) : next.add(k);
        setActiveChips(next);
    };
    const clearChips = () => setActiveChips(new Set());
    const cycleSort = (k) => {
        if (sortKey !== k) {
            setSortKey(k);
            setSortDir("asc");
            return;
        }
        if (sortDir === "asc") {
            setSortDir("desc");
            return;
        }
        setSortKey(null);
        setSortDir("asc");
    };
    const sortIndicator = (k) => (sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "");
    const toggleRow = (id, checked) => {
        const next = new Set(selectedIds);
        checked ? next.add(id) : next.delete(id);
        setSelectedIds(next);
    };
    const selectAllFiltered = (checked) => {
        if (!checked) {
            setSelectedIds(new Set());
            return;
        }
        setSelectedIds(new Set(sorted.map(x => x.id)));
    };
    const create = () => {
        pushUndo(state);
        setState({
            ...state,
            quotes: [...state.quotes, { id: uid("quote"), reference: reference || "Q-NEW", traveller: "—", destination: "—", value: "—", status, notes }],
        });
        setReference("");
        setNotes("");
        setStatus(STATUSES[0]);
    };
    const save = () => {
        if (!selected)
            return;
        pushUndo(state);
        setState({
            ...state,
            quotes: state.quotes.map(x => (x.id === selected.id ? { ...x, status, notes } : x)),
        });
    };
    const bulkStatus = (newStatus) => {
        if (selectedIds.size === 0)
            return;
        pushUndo(state);
        setState({
            ...state,
            quotes: state.quotes.map(x => (selectedIds.has(x.id) ? { ...x, status: newStatus } : x)),
        });
    };
    const bulkDelete = () => {
        if (selectedIds.size === 0)
            return;
        const n = selectedIds.size;
        if (!confirm(`Delete ${n} quote(s)?`))
            return;
        pushUndo(state);
        setState({ ...state, quotes: state.quotes.filter(x => !selectedIds.has(x.id)) });
        setSelectedIds(new Set());
        if (selectedId && selectedIds.has(selectedId))
            setSelectedId(null);
    };
    const bulkClear = () => setSelectedIds(new Set());
    const chips = STATUSES.map(s => ({ key: s, label: s }));
    return (_jsx("main", { className: "to-dashboard", children: _jsxs("section", { className: "to-section", children: [_jsx("h1", { className: "to-h1", children: "Quotes" }), _jsx("div", { className: "to-searchbar", children: _jsx("input", { className: "to-input", placeholder: "Search quotes\u2026", value: query, onChange: e => setQuery(e.target.value) }) }), _jsx(StatusChips, { chips: chips, active: activeChips, onToggle: toggleChip, onClear: clearChips }), _jsxs("div", { className: "to-table-card", children: [_jsxs("div", { className: "to-table-header", style: { gridTemplateColumns: "44px 1fr 1fr 1fr 1fr" }, children: [_jsx("span", { children: _jsx("input", { className: "to-check", type: "checkbox", checked: sorted.length > 0 && selectedIds.size === sorted.length, onChange: e => selectAllFiltered(e.target.checked) }) }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("reference"), children: ["Ref ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("reference") })] }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("traveller"), children: ["Traveller ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("traveller") })] }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("value"), children: ["Value ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("value") })] }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("status"), children: ["Status ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("status") })] })] }), sorted.map(x => (_jsxs("div", { className: "to-table-row to-table-row-clickable" + (x.id === selectedId ? " to-table-row-selected" : ""), style: { gridTemplateColumns: "44px 1fr 1fr 1fr 1fr" }, onClick: (e) => { if (e.target.tagName.toLowerCase() === "input")
                                return; setSelectedId(x.id); }, children: [_jsx("span", { children: _jsx("input", { className: "to-check", type: "checkbox", checked: selectedIds.has(x.id), onChange: e => toggleRow(x.id, e.target.checked) }) }), _jsx("span", { children: x.reference }), _jsx("span", { children: x.traveller }), _jsx("span", { children: x.value }), _jsx("span", { className: "to-pill-slim", children: x.status })] }, x.id)))] }), _jsx("div", { className: "to-actions", children: _jsx("button", { className: "to-primary-btn", onClick: create, children: "New Quote" }) }), _jsx(DetailDrawer, { isOpen: !!selectedId, title: selected ? selected.reference : "Quote", onClose: () => setSelectedId(null), children: !selected ? (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Reference" }), _jsx("input", { className: "to-input", value: reference, onChange: e => setReference(e.target.value) })] }), _jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Status" }), _jsx("select", { className: "to-input", value: status, onChange: e => setStatus(e.target.value), children: STATUSES.map(s => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: create, children: "Create" }) })] })) : (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Status" }), _jsx("select", { className: "to-input", value: status, onChange: e => setStatus(e.target.value), children: STATUSES.map(s => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: save, children: "Save" }) })] })) }), selectedIds.size > 0 ? (_jsx(BulkBar, { count: selectedIds.size, onClear: bulkClear, actions: _jsxs(_Fragment, { children: [_jsxs("select", { className: "to-input", style: { width: 220 }, defaultValue: "", onChange: e => { if (e.target.value)
                                    bulkStatus(e.target.value); e.currentTarget.value = ""; }, children: [_jsx("option", { value: "", disabled: true, children: "Set status\u2026" }), STATUSES.map(s => _jsx("option", { value: s, children: s }, s))] }), _jsx("button", { className: "to-ghost-btn", onClick: bulkDelete, type: "button", children: "Delete" })] }) })) : null] }) }));
}
