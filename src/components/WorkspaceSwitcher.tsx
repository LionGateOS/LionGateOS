import React, { useEffect, useState } from "react";
import orchestrator, { WorkspaceState } from "./WorkspaceOrchestrator";

const WorkspaceSwitcher: React.FC = () => {
  const [state, setState] = useState<WorkspaceState>(orchestrator.state);

  useEffect(() => {
    const unsubscribe = orchestrator.on(setState);
    return unsubscribe;
  }, []);

  if (state.list.length <= 1) {
    return null;
  }

  const handleClick = (id: string) => {
    orchestrator.activate(id);

    const shellEvent = new CustomEvent("os-shell:navigate", {
      detail: { routeId: id },
    });
    window.dispatchEvent(shellEvent);

    try {
      window.localStorage.setItem("lgos.shell.activePanel", id);
    } catch {
      // ignore storage issues
    }
  };

  return (
    <div className="os-ws-switcher">
      {state.list.map((ws) => (
        <button
          key={ws.id}
          type="button"
          className={
            "os-ws-tab" + (ws.id === state.activeId ? " os-ws-tab-active" : "")
          }
          onClick={() => handleClick(ws.id)}
        >
          {ws.title}
        </button>
      ))}
    </div>
  );
};

export default WorkspaceSwitcher;
