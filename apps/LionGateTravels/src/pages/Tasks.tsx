import React from "react";
import { StoreState, uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
import { StatusChips } from "../components/StatusChips";
import { BulkBar } from "../components/BulkBar";

const STATUSES = ["Open","Blocked","Done"] as const;
type SortKey = "title" | "due" | "status";

export default function Tasks({ state, setState }: { state: StoreState; setState: (s: StoreState) => void }) {
  const [query, setQuery] = React.useState("");
  const [activeChips, setActiveChips] = React.useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = selectedId ? state.tasks.find(t => t.id === selectedId) ?? null : null;

  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState<string>(STATUSES[0]);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (selected) {
      setNotes(selected.notes ?? "");
      setStatus((selected.status as any) || STATUSES[0]);
    }
  }, [selectedId]);

  const q = query.trim().toLowerCase();
  const matchesSearch = (obj: any) => !q || JSON.stringify(obj).toLowerCase().includes(q);
  const matchesChips = (obj: any) => activeChips.size === 0 || activeChips.has(String(obj.status || STATUSES[0]));

  const filtered = React.useMemo(() => {
    return state.tasks
      .map(t => ({ ...t, status: (t.status as any) || STATUSES[0] }))
      .filter(t => matchesSearch(t) && matchesChips(t));
  }, [state.tasks, query, activeChips]);

  const sorted = React.useMemo(() => {
    const arr = [...filtered];
    if (!sortKey) return arr;
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a: any, b: any) => String(a[sortKey] ?? "").toLowerCase().localeCompare(String(b[sortKey] ?? "").toLowerCase()) * dir);
    return arr;
  }, [filtered, sortKey, sortDir]);

  React.useEffect(() => { setSelectedIds(new Set()); }, [query, activeChips]);
  React.useEffect(() => { if (selectedId && !sorted.some(x => x.id === selectedId)) setSelectedId(null); }, [sorted]);

  const toggleChip = (k: string) => {
    const next = new Set(activeChips);
    next.has(k) ? next.delete(k) : next.add(k);
    setActiveChips(next);
  };
  const clearChips = () => setActiveChips(new Set());

  const cycleSort = (k: SortKey) => {
    if (sortKey !== k) { setSortKey(k); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortKey(null); setSortDir("asc");
  };
  const sortIndicator = (k: SortKey) => (sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "");

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    setSelectedIds(next);
  };
  const selectAllFiltered = (checked: boolean) => {
    if (!checked) { setSelectedIds(new Set()); return; }
    setSelectedIds(new Set(sorted.map(x => x.id)));
  };

  const create = () => {
    pushUndo(state);
    setState({
      ...state,
      tasks: [...state.tasks, { id: uid("task"), title: title || "New task", due: "—", context: "—", status, notes } as any],
    });
    setTitle(""); setNotes(""); setStatus(STATUSES[0]);
  };

  const save = () => {
    if (!selected) return;
    pushUndo(state);
    setState({
      ...state,
      tasks: state.tasks.map(t => (t.id === selected.id ? ({ ...t, status, notes } as any) : t)),
    });
  };

  const bulkStatus = (newStatus: string) => {
    if (selectedIds.size === 0) return;
    pushUndo(state);
    setState({
      ...state,
      tasks: state.tasks.map(t => (selectedIds.has(t.id) ? ({ ...t, status: newStatus } as any) : t)),
    });
  };

  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    const n = selectedIds.size;
    if (!confirm(`Delete ${n} task(s)?`)) return;
    pushUndo(state);
    setState({ ...state, tasks: state.tasks.filter(t => !selectedIds.has(t.id)) });
    setSelectedIds(new Set());
    if (selectedId && selectedIds.has(selectedId)) setSelectedId(null);
  };

  const bulkClear = () => setSelectedIds(new Set());

  const chips = STATUSES.map(s => ({ key: s, label: s }));

  return (
    <main className="to-dashboard">
      <section className="to-section">
        <h1 className="to-h1">Tasks</h1>

        <div className="to-searchbar">
          <input className="to-input" placeholder="Search tasks…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        <StatusChips chips={chips} active={activeChips} onToggle={toggleChip} onClear={clearChips} />

        <div className="to-table-card">
          <div className="to-table-header" style={{ gridTemplateColumns: "44px 1fr 1fr 1fr" }}>
            <span><input className="to-check" type="checkbox" checked={sorted.length > 0 && selectedIds.size === sorted.length} onChange={e => selectAllFiltered(e.target.checked)} /></span>
            <span className="to-sortbtn" onClick={() => cycleSort("title")}>Title <span className="to-sort-ind">{sortIndicator("title")}</span></span>
            <span className="to-sortbtn" onClick={() => cycleSort("due")}>Due Date <span className="to-sort-ind">{sortIndicator("due")}</span></span>
            <span className="to-sortbtn" onClick={() => cycleSort("status")}>Status <span className="to-sort-ind">{sortIndicator("status")}</span></span>
          </div>

          {sorted.map(x => (
            <div
              key={x.id}
              className={"to-table-row to-table-row-clickable" + (x.id === selectedId ? " to-table-row-selected" : "")}
              style={{ gridTemplateColumns: "44px 1fr 1fr 1fr" }}
              onClick={(e) => { if ((e.target as HTMLElement).tagName.toLowerCase() === "input") return; setSelectedId(x.id); }}
            >
              <span><input className="to-check" type="checkbox" checked={selectedIds.has(x.id)} onChange={e => toggleRow(x.id, e.target.checked)} /></span>
              <span>{x.title}</span><span>{x.due}</span><span className="to-pill-slim">{x.status}</span>
            </div>
          ))}
        </div>

        <div className="to-actions">
          <button className="to-primary-btn" onClick={create}>New Task</button>
        </div>

        <DetailDrawer isOpen={!!selectedId} title={selected ? selected.title : "Task"} onClose={() => setSelectedId(null)}>
          {!selected ? (
            <div className="to-drawer-grid">
              <div className="to-kv"><div className="to-k">Title</div><input className="to-input" value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div className="to-kv"><div className="to-k">Status</div><select className="to-input" value={status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e => setNotes(e.target.value)} /></div>
              <div className="to-drawer-actions"><button className="to-primary-btn" onClick={create}>Create</button></div>
            </div>
          ) : (
            <div className="to-drawer-grid">
              <div className="to-kv"><div className="to-k">Status</div><select className="to-input" value={status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e => setNotes(e.target.value)} /></div>
              <div className="to-drawer-actions"><button className="to-primary-btn" onClick={save}>Save</button></div>
            </div>
          )}
        </DetailDrawer>

        {selectedIds.size > 0 ? (
          <BulkBar
            count={selectedIds.size}
            onClear={bulkClear}
            actions={
              <>
                <select className="to-input" style={{ width: 220 }} defaultValue="" onChange={e => { if (e.target.value) bulkStatus(e.target.value); (e.currentTarget as any).value = ""; }}>
                  <option value="" disabled>Set status…</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="to-ghost-btn" onClick={bulkDelete} type="button">Delete</button>
              </>
            }
          />
        ) : null}
      </section>
    </main>
  );
}
