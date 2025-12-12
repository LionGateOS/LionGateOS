export type WorkspaceDef = { id: string; title: string; app: string };
export type WorkspaceState = { activeId: string; list: WorkspaceDef[] };

const STORAGE_KEY = "lgos.workspaces.v1";

const CORE_WORKSPACES: WorkspaceDef[] = [
  { id: "dashboard", title: "Command Center", app: "core" },
  { id: "workspace-hub", title: "Workspace Hub", app: "core" },
  { id: "settings", title: "System Settings", app: "core" },
  { id: "theme-engine", title: "Theme Engine", app: "core" },
  { id: "shell-diagnostics", title: "Shell Diagnostics", app: "core" },
];

function loadInitialState(): WorkspaceState {
  if (typeof window === "undefined") {
    return {
      activeId: "dashboard",
      list: CORE_WORKSPACES,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        activeId: "dashboard",
        list: CORE_WORKSPACES,
      };
    }

    const parsed = JSON.parse(raw) as WorkspaceState;
    const listMap = new Map(parsed.list.map((w) => [w.id, w]));
    CORE_WORKSPACES.forEach((core) => {
      if (!listMap.has(core.id)) {
        listMap.set(core.id, core);
      }
    });

    const mergedList = Array.from(listMap.values());
    const activeId = parsed.activeId || "dashboard";

    return {
      activeId,
      list: mergedList,
    };
  } catch {
    return {
      activeId: "dashboard",
      list: CORE_WORKSPACES,
    };
  }
}

class WorkspaceOrchestrator {
  state: WorkspaceState = loadInitialState();

  private listeners = new Set<(state: WorkspaceState) => void>();

  private persist() {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch {
      // ignore storage issues
    }
  }

  private emit() {
    this.persist();
    this.listeners.forEach((fn) => fn(this.state));
  }

  register(def: WorkspaceDef) {
    if (!this.state.list.find((w) => w.id === def.id)) {
      this.state = {
        ...this.state,
        list: [...this.state.list, def],
      };
      this.emit();
    }
  }

  activate(id: string) {
    if (this.state.activeId === id) return;
    this.state = { ...this.state, activeId: id };
    this.emit();
  }

  on(listener: (state: WorkspaceState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

const orchestrator = new WorkspaceOrchestrator();
export default orchestrator;
