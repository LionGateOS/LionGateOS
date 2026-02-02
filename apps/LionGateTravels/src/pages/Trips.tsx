import React from "react";
import { StoreState, uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
import { StatusChips } from "../components/StatusChips";
import { BulkBar } from "../components/BulkBar";

const STATUSES = ["Planned", "Booked", "In Progress", "Completed"] as const;
type SortKey = "traveller" | "destination" | "dates" | "status";

export default function Trips({
  state,
  setState,
}: {
  state: StoreState;
  setState: (s: StoreState) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [activeChips, setActiveChips] = React.useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const [drawerMode, setDrawerMode] = React.useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);

  const editing = drawerMode === "edit" && editId ? state.trips.find((t) => t.id === editId) ?? null : null;

  const [traveller, setTraveller] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [dates, setDates] = React.useState("");
  const [status, setStatus] = React.useState<string>(STATUSES[0]);
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
      setStatus((editing.status as any) || STATUSES[0]);
      setNotes(editing.notes ?? "");
    }
  }, [drawerMode, editId]);

  const q = query.trim().toLowerCase();
  const matchesSearch = (obj: any) => !q || JSON.stringify(obj).toLowerCase().includes(q);
  const matchesChips = (obj: any) => activeChips.size === 0 || activeChips.has(String(obj.status || STATUSES[0]));

  const filtered = React.useMemo(() => {
    return (state.trips || [])
      .map((t: any) => ({ ...t, status: t.status || STATUSES[0] }))
      .filter((t: any) => matchesSearch(t) && matchesChips(t));
  }, [state.trips, query, activeChips]);

  const sorted = React.useMemo(() => {
    const arr = [...filtered];
    if (!sortKey) return arr;
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort(
      (a: any, b: any) =>
        String(a[sortKey] ?? "")
          .toLowerCase()
          .localeCompare(String(b[sortKey] ?? "").toLowerCase()) * dir
    );
    return arr;
  }, [filtered, sortKey, sortDir]);

  React.useEffect(() => setSelectedIds(new Set()), [query, activeChips]);

  const toggleChip = (k: string) => {
    const next = new Set(activeChips);
    next.has(k) ? next.delete(k) : next.add(k);
    setActiveChips(next);
  };
  const clearChips = () => setActiveChips(new Set());

  const cycleSort = (k: SortKey) => {
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
  const sortIndicator = (k: SortKey) => (sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "");

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    setSelectedIds(next);
  };
  const selectAllFiltered = (checked: boolean) => {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(sorted.map((t) => t.id)));
  };

  const openCreate = () => setDrawerMode("create");
  const openEdit = (id: string) => {
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
        } as any,
      ],
    });
    closeDrawer();
  };

  const save = () => {
    if (!editing) return;
    pushUndo(state);
    setState({
      ...state,
      trips: (state.trips || []).map((t: any) =>
        t.id === editing.id
          ? ({
              ...t,
              traveller: traveller || "—",
              destination: destination || "—",
              dates: dates || "—",
              status,
              notes,
            } as any)
          : t
      ),
    });
    closeDrawer();
  };

  const bulkStatus = (newStatus: string) => {
    if (selectedIds.size === 0) return;
    pushUndo(state);
    setState({
      ...state,
      trips: (state.trips || []).map((t: any) => (selectedIds.has(t.id) ? ({ ...t, status: newStatus } as any) : t)),
    });
  };

  const bulkClear = () => setSelectedIds(new Set());

  const chips = STATUSES.map((s) => ({ key: s, label: s }));

  return (
    <main className="to-dashboard">
      <section className="to-section">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 className="to-h1">Trips</h1>
          <button className="to-primary-btn" onClick={openCreate} type="button">
            New Trip
          </button>
        </div>

        <div className="to-searchbar">
          <input className="to-input" placeholder="Search trips…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <StatusChips chips={chips} active={activeChips} onToggle={toggleChip} onClear={clearChips} />

        <div className="to-table-card">
          <div className="to-table-header" style={{ gridTemplateColumns: "44px 1.2fr 1fr 1fr 1fr" }}>
            <span>
              <input
                className="to-check"
                type="checkbox"
                checked={sorted.length > 0 && selectedIds.size === sorted.length}
                onChange={(e) => selectAllFiltered(e.target.checked)}
              />
            </span>
            <span className="to-sortbtn" onClick={() => cycleSort("traveller")}>
              Traveller <span className="to-sort-ind">{sortIndicator("traveller")}</span>
            </span>
            <span className="to-sortbtn" onClick={() => cycleSort("destination")}>
              Destination <span className="to-sort-ind">{sortIndicator("destination")}</span>
            </span>
            <span className="to-sortbtn" onClick={() => cycleSort("dates")}>
              Start Date <span className="to-sort-ind">{sortIndicator("dates")}</span>
            </span>
            <span className="to-sortbtn" onClick={() => cycleSort("status")}>
              Status <span className="to-sort-ind">{sortIndicator("status")}</span>
            </span>
          </div>

          {sorted.length === 0 ? (
            <div className="to-empty">
              <strong>No trips yet.</strong> Click <strong>New Trip</strong> to create your first trip.
            </div>
          ) : null}

          {sorted.map((t: any) => (
            <div
              key={t.id}
              className="to-table-row to-table-row-clickable"
              style={{ gridTemplateColumns: "44px 1.2fr 1fr 1fr 1fr" }}
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName.toLowerCase() === "input") return;
                openEdit(t.id);
              }}
            >
              <span>
                <input className="to-check" type="checkbox" checked={selectedIds.has(t.id)} onChange={(e) => toggleRow(t.id, e.target.checked)} />
              </span>
              <span>{t.traveller}</span>
              <span>{t.destination}</span>
              <span>{t.dates}</span>
              <span className="to-pill-slim">{t.status}</span>
            </div>
          ))}
        </div>

        <DetailDrawer
          isOpen={drawerMode !== null}
          title={drawerMode === "create" ? "New Trip" : editing ? editing.traveller : "Trip"}
          onClose={closeDrawer}
        >
          <div className="to-drawer-grid">
            <div className="to-kv">
              <div className="to-k">Traveller</div>
              <input className="to-input" value={traveller} onChange={(e) => setTraveller(e.target.value)} />
            </div>
            <div className="to-kv">
              <div className="to-k">Status</div>
              <select className="to-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="to-kv">
              <div className="to-k">Destination</div>
              <input className="to-input" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Paris" />
            </div>
            <div className="to-kv">
              <div className="to-k">Dates</div>
              <input className="to-input" value={dates} onChange={(e) => setDates(e.target.value)} placeholder="e.g., 2026-01-10 → 2026-01-18" />
            </div>

            <div className="to-kv to-kv-wide">
              <div className="to-k">Notes</div>
              <textarea className="to-input to-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="to-drawer-actions">
              {drawerMode === "create" ? (
                <button className="to-primary-btn" onClick={create} type="button">
                  Create
                </button>
              ) : (
                <button className="to-primary-btn" onClick={save} type="button">
                  Save
                </button>
              )}
            </div>
          </div>
        </DetailDrawer>

        {selectedIds.size > 0 ? (
          <BulkBar
            count={selectedIds.size}
            onClear={bulkClear}
            actions={
              <select
                className="to-input"
                style={{ width: 220 }}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) bulkStatus(e.target.value);
                  (e.currentTarget as any).value = "";
                }}
              >
                <option value="" disabled>
                  Set status…
                </option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            }
          />
        ) : null}
      </section>
    </main>
  );
}
