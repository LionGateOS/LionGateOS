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

  return (
    <div className="os-ws-switcher">
      {state.list.map((ws) => (
        <button
          key={ws.id}
          type="button"
          className={
            "os-ws-tab" + (ws.id === state.activeId ? " os-ws-tab-active" : "")
          }
          onClick={() => orchestrator.activate(ws.id)}
        >
          {ws.title}
        </button>
      ))}
    </div>
  );
};

export default WorkspaceSwitcher;
