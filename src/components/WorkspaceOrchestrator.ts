export type WorkspaceDef = { id: string; title: string; app: string };
export type WorkspaceState = { activeId: string; list: WorkspaceDef[] };

class WorkspaceOrchestrator {
  state: WorkspaceState = {
    activeId: "dashboard",
    list: [{ id: "dashboard", title: "Command Center", app: "core" }],
  };

  private listeners = new Set<(state: WorkspaceState) => void>();

  register(def: WorkspaceDef) {
    if (!this.state.list.find((w) => w.id === def.id)) {
      this.state.list = [...this.state.list, def];
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

  private emit() {
    this.listeners.forEach((fn) => fn(this.state));
  }
}

const orchestrator = new WorkspaceOrchestrator();
export default orchestrator;
