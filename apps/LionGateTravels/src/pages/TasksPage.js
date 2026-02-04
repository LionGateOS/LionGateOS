import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import { uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
export const TasksPage = ({ state, setState }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const matches = (obj) => !q || JSON.stringify(obj).toLowerCase().includes(q);
    const selected = useMemo(() => selectedId ? state.tasks.find(t => t.id === selectedId) ?? null : null, [selectedId, state]);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const dirty = selected ? notes !== (selected.notes ?? "") : title !== "";
    React.useEffect(() => { if (selected) {
        setNotes(selected.notes ?? "");
    } }, [selected]);
    const create = () => { pushUndo(state); setState({ ...state, tasks: [...state.tasks, { id: uid("task"), title: title || "New task", due: "—", context: "—", notes }] }); };
    const save = () => { if (!selected)
        return; pushUndo(state); setState({ ...state, tasks: state.tasks.map(t => t.id === selected.id ? { ...t, notes } : t) }); };
    return (_jsx("main", { className: "to-dashboard", children: _jsxs("section", { className: "to-section", children: [_jsx("h1", { className: "to-h1", children: "Tasks" }), _jsx("div", { className: "to-searchbar", children: _jsx("input", { className: "to-input", placeholder: "Search tasks\u2026", value: query, onChange: e => setQuery(e.target.value) }) }), _jsxs("div", { className: "to-table-card", children: [_jsxs("div", { className: "to-table-header to-table-header-3", children: [_jsx("span", { children: "Task" }), _jsx("span", { children: "When" }), _jsx("span", { children: "Related to" })] }), state.tasks.filter(matches).map(t => (_jsxs("div", { className: "to-table-row to-table-row-3 to-table-row-clickable" + (t.id === selectedId ? " to-table-row-selected" : ""), onClick: () => setSelectedId(t.id), children: [_jsx("span", { children: t.title }), _jsx("span", { children: t.due }), _jsx("span", { children: t.context })] }, t.id)))] }), _jsx(DetailDrawer, { isOpen: !!selectedId, title: selected ? selected.title : "New Task", dirty: dirty, onClose: () => setSelectedId(null), children: !selected ? (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv", children: [_jsx("div", { className: "to-k", children: "Title" }), _jsx("input", { className: "to-input", value: title, onChange: e => setTitle(e.target.value) })] }), _jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: create, children: "Create" }) })] })) : (_jsxs("div", { className: "to-drawer-grid", children: [_jsxs("div", { className: "to-kv to-kv-wide", children: [_jsx("div", { className: "to-k", children: "Notes" }), _jsx("textarea", { className: "to-textarea", value: notes, onChange: e => setNotes(e.target.value) })] }), _jsx("div", { className: "to-drawer-actions", children: _jsx("button", { className: "to-primary-btn", onClick: save, children: "Save" }) })] })) })] }) }));
};
