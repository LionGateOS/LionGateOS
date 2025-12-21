import React, { useEffect, useState } from "react";
import orchestrator from "./WorkspaceOrchestrator";

/**
 * STEP 7 — Stabilization
 * - Use the codebase's existing TOP BAR bean classes (lg-*) for correct styling.
 * - Enforce OS-safe close behavior: never allow zero workspaces.
 */

export default function WorkspaceSwitcher(): JSX.Element {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = orchestrator.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const open = orchestrator.getOpen();
  const activeId = orchestrator.getActiveId();

  const ensureFallback = () => {
    const current = orchestrator.getOpen();
    const hasCommand = current.some((w) => w.id === "command-center");

    if (!hasCommand) {
      orchestrator.register({
        id: "command-center",
        title: "Command Center",
        app: "command-center",
      });
    }
    orchestrator.activate("command-center");
  };

  const handleClose = (id: string) => {
    const before = orchestrator.getOpen();

    // Never allow closing the last workspace.
    if (before.length <= 1) {
      ensureFallback();
      return;
    }

    const wasActive = orchestrator.getActiveId() === id;

    // Close if supported by orchestrator.
    if (typeof orchestrator.close === "function") {
      orchestrator.close(id);
    } else {
      // If close is not supported, do nothing (still OS-safe).
      return;
    }

    const after = orchestrator.getOpen();
    if (after.length === 0) {
      ensureFallback();
      return;
    }

    if (wasActive) {
      // Activate the next best workspace.
      const next = after[0]?.id;
      if (next) orchestrator.activate(next);
      else ensureFallback();
    }
  };

  return (
    <div className="lg-topbar-beans" role="tablist" aria-label="Workspaces">
      {open.map((w) => {
        const isActive = w.id === activeId;

        return (
          <button
            key={w.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? "lg-bean lg-bean--active" : "lg-bean"}
            onClick={() => orchestrator.activate(w.id)}
            title={w.title}
          >
            <span className={isActive ? "lg-bean-dot lg-bean-dot--active" : "lg-bean-dot"} aria-hidden="true" />
            <span className="lg-bean-title">{w.title}</span>

            {typeof orchestrator.close === "function" ? (
              <span
                className="lg-bean-close"
                role="button"
                aria-label={`Close ${w.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose(w.id);
                }}
              >
                ×
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
