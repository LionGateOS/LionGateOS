import React, { useEffect } from "react";
import orchestrator, { WorkspaceState } from "./WorkspaceOrchestrator";

const KeyboardNavigator: React.FC = () => {
  useEffect(() => {
    let currentState: WorkspaceState = orchestrator.state;

    const unsubscribe = orchestrator.on((state) => {
      currentState = state;
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + ArrowRight / ArrowLeft cycles workspaces
      if (!event.ctrlKey) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

      event.preventDefault();

      const list = currentState.list;
      if (!list || list.length === 0) return;

      const currentIndex = list.findIndex(
        (w) => w.id === currentState.activeId
      );
      if (currentIndex === -1) return;

      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + list.length) % list.length;
      const nextWorkspace = list[nextIndex];

      orchestrator.activate(nextWorkspace.id);

      // Keep shell navigation and WorkspaceHost in sync
      const shellEvent = new CustomEvent("os-shell:navigate", {
        detail: { routeId: nextWorkspace.id },
      });
      window.dispatchEvent(shellEvent);

      try {
        window.localStorage.setItem(
          "lgos.shell.activePanel",
          nextWorkspace.id
        );
      } catch {
        // ignore storage issues
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unsubscribe();
    };
  }, []);

  return null;
};

export default KeyboardNavigator;
