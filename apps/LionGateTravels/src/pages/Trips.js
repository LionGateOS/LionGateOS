import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
import { StatusChips } from "../components/StatusChips";
import { BulkBar } from "../components/BulkBar";
const STATUSES = ["Planned", "Booked", "In Progress", "Completed"];
export default function Trips({ state, setState, }) {
    const [query, setQuery] = React.useState("");
    const [activeChips, setActiveChips] = React.useState(new Set());
    const [sortKey, setSortKey] = React.useState(null);
    const [sortDir, setSortDir] = React.useState("asc");
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [drawerMode, setDrawerMode] = React.useState(null);
    const [editId, setEditId] = React.useState(null);
    const editing = drawerMode === "edit" && editId ? state.trips.find((t) => t.id === editId) ?? null : null;
    const [traveller, setTraveller] = React.useState("");
    const [destination, setDestination] = React.useState("");
    const [dates, setDates] = React.useState("");
    const [status, setStatus] = React.useState(STATUSES[0]);
    const [notes, setNotes] = React.useState("");
    // hydrate drawer fields on open
    React.useEffect(() => {
        if (drawerMode === "create") {
            setTraveller("");
            setDestination("");
            setDates("");
            setStatus(STATUSES[0]);
            setNotes("");
        }
        if (drawerMode === "edit" && editing) {
            setTraveller(editing.traveller ?? "");
            setDestination(editing.destination ?? "");
            setDates(editing.dates ?? "");
            setStatus(editing.status || STATUSES[0]);
            setNotes(editing.notes ?? "");
        }
    }, [drawerMode, editId]);
    const q = query.trim().toLowerCase();
    const matchesSearch = (obj) => !q || JSON.stringify(obj).toLowerCase().includes(q);
    const matchesChips = (obj) => activeChips.size === 0 || activeChips.has(String(obj.status || STATUSES[0]));
    const filtered = React.useMemo(() => {
        return (state.trips || [])
            .map((t) => ({ ...t, status: t.status || STATUSES[0] }))
            .filter((t) => matchesSearch(t) && matchesChips(t));
    }, [state.trips, query, activeChips]);
    const sorted = React.useMemo(() => {
        const arr = [...filtered];
        if (!sortKey)
            return arr;
        const dir = sortDir === "asc" ? 1 : -1;
        arr.sort((a, b) => String(a[sortKey] ?? "")
            .toLowerCase()
            .localeCompare(String(b[sortKey] ?? "").toLowerCase()) * dir);
        return arr;
    }, [filtered, sortKey, sortDir]);
    React.useEffect(() => setSelectedIds(new Set()), [query, activeChips]);
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
        setSelectedIds(new Set(sorted.map((t) => t.id)));
    };
    const openCreate = () => setDrawerMode("create");
    const openEdit = (id) => {
        setEditId(id);
        setDrawerMode("edit");
    };
    const closeDrawer = () => {
        setDrawerMode(null);
        setEditId(null);
    };
    const create = () => {
        pushUndo(state);
        setState({
            ...state,
            trips: [
                ...(state.trips || []),
                {
                    id: uid("trip"),
                    traveller: traveller || "New traveller",
                    destination: destination || "—",
                    dates: dates || "—",
                    status,
                    notes,
                },
            ],
        });
        closeDrawer();
    };
    const save = () => {
        if (!editing)
            return;
        pushUndo(state);
        setState({
            ...state,
            trips: (state.trips || []).map((t) => t.id === editing.id
                ? {
                    ...t,
                    traveller: traveller || "—",
                    destination: destination || "—",
                    dates: dates || "—",
                    status,
                    notes,
                }
                : t),
        });
        closeDrawer();
    };
    const bulkStatus = (newStatus) => {
        if (selectedIds.size === 0)
            return;
        pushUndo(state);
        setState({
            ...state,
            trips: (state.trips || []).map((t) => (selectedIds.has(t.id) ? { ...t, status: newStatus } : t)),
        });
    };
    const bulkClear = () => setSelectedIds(new Set());
    const chips = STATUSES.map((s) => ({ key: s, label: s }));
    return (_jsx("main", { className: "to-dashboard", children: _jsxs("section", { className: "to-section", children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }, children: [_jsx("h1", { className: "to-h1", children: "Trips" }), _jsx("button", { className: "to-primary-btn", onClick: openCreate, type: "button", children: "New Trip" })] }), _jsx("div", { className: "to-searchbar", children: _jsx("input", { className: "to-input", placeholder: "Search trips\u2026", value: query, onChange: (e) => setQuery(e.target.value) }) }), _jsx(StatusChips, { chips: chips, active: activeChips, onToggle: toggleChip, onClear: clearChips }), _jsxs("div", { className: "to-table-card", children: [_jsxs("div", { className: "to-table-header", style: { gridTemplateColumns: "44px 1.2fr 1fr 1fr 1fr" }, children: [_jsx("span", { children: _jsx("input", { className: "to-check", type: "checkbox", checked: sorted.length > 0 && selectedIds.size === sorted.length, onChange: (e) => selectAllFiltered(e.target.checked) }) }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("traveller"), children: ["Traveller ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("traveller") })] }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("destination"), children: ["Destination ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("destination") })] }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("dates"), children: ["Start Date ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("dates") })] }), _jsxs("span", { className: "to-sortbtn", onClick: () => cycleSort("status"), children: ["Status ", _jsx("span", { className: "to-sort-ind", children: sortIndicator("status") })] })] }), sorted.length === 0 ? (_jsxs("div", { className: "to-empty", children: [_jsx("strong", { children: "No trips yet." }), " Click ", _jsx("strong", { children: "New Trip" }), " to create your first trip."] })) : null, sorted.map((t) => (_jsxs("div", { className: "to-table-row to-table-row-clickable", style: { gridTemplateColumns: "44px 1.2fr 1fr 1fr 1fr" }, onClick: (e) => {
                                if (e.target.tagName.toLowerCase() === "input")
                                    return;
                                openEdit(t.id);
                            }, children: [_jsx("span", { children: _jsx("input", { className: "to-check", type: "checkbox", checked: selectedIds.has(t.id), onChange: (e) => toggleRow(t.id, e.target.checked) }) }), _jsx("span", { children: t.traveller }), _jsx("span", { children: t.destination }), _jsx("span", { children: t.dates }), _jsx("span", { className: "to-pill-slim", children: t.status })] }, t.id)))] }), _jsx(DetailDrawer, { isOpen: drawerMode !== null, title: drawerMode === "create" ? "New Trip" : editing ? editing.traveller : "Trip", onClose: closeDrawer, children: _jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Traveller" }), _jsx("input", { className: "to-input", value: traveller, onChange: (e) => setTraveller(e.target.value) })] }), _jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Status" }), _jsx("select", { className: "to-input", value: status, onChange: (e) => setStatus(e.target.value), children: STATUSES.map((s) => (_jsx("option", { children: s }, s))) })] }), _jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Destination" }), _jsx("input", { className: "to-input", value: destination, onChange: (e) => setDestination(e.target.value), placeholder: "e.g., Paris" })] }), _jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Dates" }), _jsx("input", { className: "to-input", value: dates, onChange: (e) => setDates(e.target.value), placeholder: "e.g., 2026-01-10 \u2192 2026-01-18" })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-input to-textarea", value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: drawerMode === "create" ? (_jsx("button", { className: "to-primary-btn", onClick: create, type: "button", children: "Create" })) : (_jsx("button", { className: "to-primary-btn", onClick: save, type: "button", children: "Save" })) })] }) }), selectedIds.size > 0 ? (_jsx(BulkBar, { count: selectedIds.size, onClear: bulkClear, actions: _jsxs("select", { className: "to-input", style: { width: 220 }, defaultValue: "", onChange: (e) => {
                            if (e.target.value)
                                bulkStatus(e.target.value);
                            e.currentTarget.value = "";
                        }, children: [_jsx("option", { value: "", disabled: true, children: "Set status\u2026" }), STATUSES.map((s) => (_jsx("option", { value: s, children: s }, s)))] }) })) : null] }) }));
}
