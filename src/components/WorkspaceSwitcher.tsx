import React, { useEffect, useState } from "react";
import orchestrator from "./WorkspaceOrchestrator";

/**
 * WorkspaceSwitcher — TOP BAR "bean tabs" (PRIMARY)
 * Requirements:
 * - Beans accumulate horizontally in TOP BAR
 * - Active bean shows a blue dot
 * - Clicking activates (does not re-open duplicates)
 * - Close button removes the bean (if orchestrator.close exists)
 */

export default function WorkspaceSwitcher(): JSX.Element {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = orchestrator.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const list = orchestrator.getOpen();
  const activeId = orchestrator.getActiveId();

  return (
    <div className="os-ws-switcher" role="tablist" aria-label="Workspaces">
      {list.map((w) => {
        const isActive = w.id === activeId;

        return (
          <button
            key={w.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? "os-ws-tab os-ws-tab-active" : "os-ws-tab"}
            onClick={() => orchestrator.activate(w.id)}
            title={w.title}
          >
            <span className={isActive ? "os-ws-dot os-ws-dot-active" : "os-ws-dot"} aria-hidden="true" />
            <span className="os-ws-title">{w.title}</span>

            {/* Close is optional; only shown if orchestrator.close exists */}
            {typeof (orchestrator as any).close === "function" ? (
              <span
                className="os-ws-close"
                role="button"
                aria-label={`Close ${w.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  (orchestrator as any).close(w.id);
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
