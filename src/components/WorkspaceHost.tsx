import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  setWorkspaceStatus,
  getWorkspaceStatus,
} from "../system/workspaceStatus";

export type WorkspaceBean = {
  id: string;
  key: string;
  title: string;
  route: string;
  createdAt: number;
};

const ROUTE_MAP = [
  { prefix: "/hub", key: "workspace-hub", title: "Workspace Hub", route: "/hub" },
  { prefix: "/command", key: "command-center", title: "Command Center", route: "/command" },
  { prefix: "/smartquote", key: "smartquote", title: "SmartQuote AI", route: "/smartquote" },
  { prefix: "/travels", key: "travels", title: "LionGate Travels", route: "/travels" },
  { prefix: "/settings", key: "settings", title: "Settings", route: "/settings" },
];

function stableIdFor(key: string, route: string) {
  return `${key}:${route}`;
}

function addOrActivateBean(
  beans: WorkspaceBean[],
  bean: WorkspaceBean
): { beans: WorkspaceBean[]; activeId: string } {
  const existing = beans.find((b) => b.id === bean.id);
  if (existing) {
    return { beans, activeId: existing.id };
  }
  return { beans: [...beans, bean], activeId: bean.id };
}

export default function WorkspaceHost() {
  const location = useLocation();
  const navigate = useNavigate();

  const [beans, setBeans] = useState<WorkspaceBean[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const lastRouteRef = useRef<string | null>(null);

  const current = useMemo(() => {
    return ROUTE_MAP.find((r) => location.pathname.startsWith(r.prefix)) ?? null;
  }, [location.pathname]);

  /**
   * ROUTE → WORKSPACE SYNC
   */
  useEffect(() => {
    if (!current) return;
    if (lastRouteRef.current === current.route) return;

    lastRouteRef.current = current.route;

    const id = stableIdFor(current.key, current.route);

    const bean: WorkspaceBean = {
      id,
      key: current.key,
      title: current.title,
      route: current.route,
      createdAt: Date.now(),
    };

    setBeans((prev) => {
      const { beans: nextBeans, activeId: nextActive } = addOrActivateBean(prev, bean);
      setActiveId(nextActive);
      setWorkspaceStatus(current.key, "active");
      return nextBeans;
    });
  }, [current]);

  /**
   * OS-NATIVE WORKSPACE OPEN
   */
  const openWorkspaceByRoute = (route: string) => {
    const def = ROUTE_MAP.find((r) => r.route === route);
    if (!def) return;

    const id = stableIdFor(def.key, def.route);

    setBeans((prev) => {
      const bean: WorkspaceBean = {
        id,
        key: def.key,
        title: def.title,
        route: def.route,
        createdAt: Date.now(),
      };

      const { beans: nextBeans, activeId: nextActive } = addOrActivateBean(prev, bean);
      setActiveId(nextActive);
      setWorkspaceStatus(def.key, "active");
      return nextBeans;
    });

    if (location.pathname !== def.route) {
      navigate(def.route);
    }
  };

  /**
   * CLOSE WORKSPACE
   */
  const closeWorkspace = (id: string) => {
    setBeans((prev) => {
      const closing = prev.find((b) => b.id === id);
      if (closing) {
        setWorkspaceStatus(closing.key, "idle");
      }

      const next = prev.filter((b) => b.id !== id);

      if (activeId === id) {
        const fallback = next[next.length - 1];
        if (fallback) {
          setActiveId(fallback.id);
          setWorkspaceStatus(fallback.key, "active");
          navigate(fallback.route);
        } else {
          setActiveId(null);
          navigate("/hub");
        }
      }

      return next;
    });
  };

  /**
   * ACTIVATE WORKSPACE
   */
  const activateWorkspace = (id: string) => {
    const bean = beans.find((b) => b.id === id);
    if (!bean) return;

    setActiveId(id);
    setWorkspaceStatus(bean.key, "active");
    navigate(bean.route);
  };

  return (
    <div className="workspace-host">
      {/* TOP BAR BEANS */}
      <div className="workspace-beans">
        {beans.map((b) => (
          <div
            key={b.id}
            className={`workspace-bean ${b.id === activeId ? "active" : ""}`}
            onClick={() => activateWorkspace(b.id)}
          >
            <span className="dot" />
            <span className="title">{b.title}</span>
            <button onClick={() => closeWorkspace(b.id)}>×</button>
          </div>
        ))}
      </div>

      {/* WORKSPACE CONTENT */}
      <div className="workspace-content">
        <Outlet context={{ openWorkspaceByRoute }} />
      </div>
    </div>
  );
}
