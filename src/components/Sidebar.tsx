import React, { useCallback, useMemo, useState } from "react";
import orchestrator from "./WorkspaceOrchestrator";

type NavItem = {
  id: string;
  label: string;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

const STORAGE_KEY = "lgos.shell.activePanel";

const getInitialActiveId = (): string => {
  if (typeof window === "undefined") return "dashboard";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored || "dashboard";
  } catch {
    return "dashboard";
  }
};

const SidebarComponent: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(() => getInitialActiveId());

  const sections = useMemo<NavSection[]>(
    () => [
      {
        id: "core",
        label: "Core",
        items: [
          { id: "dashboard", label: "Command Center" },
          { id: "workspace-hub", label: "Workspace Hub" },
        ],
      },
      {
        id: "apps",
        label: "Apps",
        items: [
          { id: "smartquote", label: "SmartQuote AI" },
          {
            id: "travel-orchestrator",
            label: "LionGate Travels",
          },
        ],
      },
      {
        id: "system",
        label: "System",
        items: [
          { id: "settings", label: "System Settings" },
          { id: "theme-engine", label: "Theme Engine" },
          { id: "shell-diagnostics", label: "Shell Diagnostics" },
        ],
      },
    ],
    []
  );

  const handleNavClick = useCallback((id: string) => {
    setActiveId(id);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, id);
      }
    } catch {
      // ignore storage issues
    }

    if (id === "smartquote") {
      orchestrator.register({
        id: "smartquote",
        title: "SmartQuote AI",
        app: "smartquote",
      });
    } else if (id === "travel-orchestrator") {
      orchestrator.register({
        id: "travel-orchestrator",
        title: "LionGate Travels",
        app: "travel-orchestrator",
      });
    }

    orchestrator.activate(id);

    const event = new CustomEvent("os-shell:navigate", {
      detail: { routeId: id },
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <aside className="os-sidebar os-sidebar-expanded">
      <div className="os-sidebar-header">
        <span className="os-sidebar-title">Navigation</span>
      </div>

      <nav className="os-sidebar-nav">
        {sections.map((section) => (
          <div key={section.id} className="os-sidebar-section">
            <div className="os-sidebar-section-label">{section.label}</div>
            <ul className="os-sidebar-list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={
                      "os-sidebar-item" +
                      (activeId === item.id ? " os-sidebar-item-active" : "")
                    }
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="os-sidebar-bullet" aria-hidden="true">
                      •
                    </span>
                    <span className="os-sidebar-item-label">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const Sidebar = React.memo(SidebarComponent);
Sidebar.displayName = "Sidebar";

export default Sidebar;
