/**
 * LionGateOS — WorkspaceOrchestrator
 * Purpose: Maintain an OS-level "open workspaces" list (top tabs / beans) and the active workspace.
 *
 * Design goals:
 * - No framework dependencies (simple singleton).
 * - Safe localStorage usage with try/catch (never crash UI).
 * - Works even if Sidebar does NOT explicitly register workspaces.
 * - Emits change events for React components to subscribe.
 */

export type WorkspaceEntry = {
  id: string;
  title: string;
  app?: string;
};

type Listener = () => void;

const STORAGE_OPEN_KEY = "lgos.shell.openWorkspaces";
const STORAGE_ACTIVE_KEY = "lgos.shell.activePanel";

const safeReadJson = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const safeWriteJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const safeWriteString = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

const uniqById = (items: WorkspaceEntry[]): WorkspaceEntry[] => {
  const seen = new Set<string>();
  const out: WorkspaceEntry[] = [];
  for (const it of items) {
    if (!it?.id) continue;
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
};

class WorkspaceOrchestrator {
  private listeners = new Set<Listener>();

  /** Returns current open workspaces. */
  getOpen(): WorkspaceEntry[] {
    return safeReadJson<WorkspaceEntry[]>(STORAGE_OPEN_KEY, []);
  }

  /** Returns active workspace id (or empty string if none). */
  getActiveId(): string {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage.getItem(STORAGE_ACTIVE_KEY) || "";
    } catch {
      return "";
    }
  }

  /**
   * Ensure a workspace exists in the open list.
   * - If it exists, updates its title/app (non-destructive).
   * - If it doesn't, appends it to the end (so tabs "accumulate" as you click).
   */
  register(entry: WorkspaceEntry) {
    if (!entry?.id) return;

    const current = this.getOpen();
    const idx = current.findIndex((w) => w.id === entry.id);

    if (idx >= 0) {
      const prev = current[idx];
      const merged: WorkspaceEntry = {
        ...prev,
        ...entry,
        title: entry.title || prev.title,
      };
      const next = current.slice();
      next[idx] = merged;
      safeWriteJson(STORAGE_OPEN_KEY, uniqById(next));
      this.emit();
      return;
    }

    const next = uniqById([...current, entry]);
    safeWriteJson(STORAGE_OPEN_KEY, next);
    this.emit();
  }

  /**
   * Activate a workspace:
   * - Sets active id in storage
   * - Emits change to subscribers
   */
  activate(id: string) {
    if (!id) return;
    safeWriteString(STORAGE_ACTIVE_KEY, id);
    this.emit();
  }

  /**
   * Convenience: register + activate in one call.
   */
  open(entry: WorkspaceEntry) {
    this.register(entry);
    this.activate(entry.id);
  }

  /**
   * Close a workspace (optional UI usage).
   * If you close the active one, it activates the previous tab (or last tab).
   */
  close(id: string) {
    if (!id) return;
    const current = this.getOpen();
    const next = current.filter((w) => w.id !== id);
    safeWriteJson(STORAGE_OPEN_KEY, next);

    const active = this.getActiveId();
    if (active === id) {
      const fallback = next[next.length - 1]?.id || "dashboard";
      safeWriteString(STORAGE_ACTIVE_KEY, fallback);
    }

    this.emit();
  }

  /** Subscribe to orchestrator changes (returns unsubscribe). */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Emit changes to all listeners. */
  private emit() {
    for (const fn of this.listeners) {
      try {
        fn();
      } catch {
        // ignore
      }
    }
  }
}

const orchestrator = new WorkspaceOrchestrator();
export default orchestrator;
