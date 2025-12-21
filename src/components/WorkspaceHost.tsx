import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "../system/dashboard/Dashboard";

type WorkspaceKey =
  | "command-center"
  | "workspace-hub"
  | "smartquote-ai"
  | "settings"
  | "security-center"
  | "unknown";

type WorkspaceBean = {
  id: string;
  key: WorkspaceKey;
  title: string;
  route: string;
  createdAt: number;
};

const ROUTE_MAP: Array<{ prefix: string; key: WorkspaceKey; title: string; route: string }> = [
  { prefix: "/command", key: "command-center", title: "Command Center", route: "/command" },
  { prefix: "/hub", key: "workspace-hub", title: "Workspace Hub", route: "/hub" },
  { prefix: "/smartquote", key: "smartquote-ai", title: "SmartQuote AI", route: "/smartquote" },
  { prefix: "/settings", key: "settings", title: "Settings", route: "/settings" },
  { prefix: "/security", key: "security-center", title: "Security Center", route: "/security" },
];

function routeToWorkspace(pathname: string): { key: WorkspaceKey; title: string; route: string } {
  const match = ROUTE_MAP.find(
    (r) =>
      pathname === r.route ||
      pathname.startsWith(r.prefix + "/") ||
      pathname.startsWith(r.prefix + "?") ||
      pathname.startsWith(r.prefix + "#") ||
      pathname === r.prefix
  );
  if (match) return { key: match.key, title: match.title, route: match.route };
  if (pathname === "/" || pathname === "") return { key: "workspace-hub", title: "Workspace Hub", route: "/hub" };
  return { key: "unknown", title: "Workspace", route: pathname };
}

function stableIdFor(key: WorkspaceKey, route: string): string {
  return key === "unknown" ? `ws:${key}:${route}` : `ws:${key}`;
}

function addOrActivateBean(
  beans: WorkspaceBean[],
  bean: WorkspaceBean
): { beans: WorkspaceBean[]; activeId: string } {
  const idx = beans.findIndex((b) => b.id === bean.id);
  if (idx >= 0) {
    const existing = beans[idx];
    const updated = { ...existing, title: bean.title, route: bean.route };
    const next = [...beans.slice(0, idx), updated, ...beans.slice(idx + 1)];
    return { beans: next, activeId: updated.id };
  }
  return { beans: [...beans, bean], activeId: bean.id };
}

export default function WorkspaceHost(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const [beans, setBeans] = useState<WorkspaceBean[]>(() => []);
  const [activeId, setActiveId] = useState<string>("");

  const current = useMemo(() => routeToWorkspace(location.pathname), [location.pathname]);

  useEffect(() => {
    // Force a real workspace on first load so the Outlet can render.
    if (location.pathname === "/") {
      navigate("/hub", { replace: true });
      return;
    }

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
      return nextBeans;
    });
  }, [current.key, current.route, current.title, location.pathname, navigate]);

  const activate = (id: string) => {
    const bean = beans.find((b) => b.id === id);
    if (!bean) return;
    setActiveId(id);
    if (location.pathname !== bean.route) navigate(bean.route);
  };

  const close = (id: string) => {
    setBeans((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;

      const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];

      // Safety: never allow the UI to end up with zero workspaces.
      // If the last bean is closed, fall back to Workspace Hub.
      if (next.length === 0) {
        const hub: WorkspaceBean = { id: "hub", label: "Workspace Hub", route: "/hub", kind: "core" };
        setActiveId("hub");
        if (location.pathname !== "/hub") navigate("/hub");
        return [hub];
      }

      if (id === activeId) {
        const fallback = next[idx - 1] ?? next[idx] ?? next[next.length - 1];
        const nextActive = fallback?.id ?? "hub";
        setActiveId(nextActive);

        const targetRoute = fallback?.route ?? "/hub";
        if (location.pathname !== targetRoute) navigate(targetRoute);
      }
      return next;
    });
  };

  return (
    <div className="lg-workspace-host">
      <div className="lg-topbar">
        <div className="lg-topbar-beans" role="tablist" aria-label="Workspaces">
          {beans.map((b) => {
            const isActive = b.id === activeId;
            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? "lg-bean lg-bean--active" : "lg-bean"}
                onClick={() => activate(b.id)}
                title={b.title}
              >
                <span className={isActive ? "lg-bean-dot lg-bean-dot--active" : "lg-bean-dot"} aria-hidden="true" />
                <span className="lg-bean-title">{b.title}</span>
                <span className="lg-bean-spacer" aria-hidden="true" />
                <span
                  className="lg-bean-close"
                  role="button"
                  aria-label={`Close ${b.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    close(b.id);
                  }}
                >
                  ×
                </span>
              </button>
            );
          })}
        </div>
        <div className="lg-topbar-fade" aria-hidden="true" />
      </div>

      <div className="lg-workspace-content">
        {current.key === "workspace-hub" ? <Dashboard /> : <Outlet />}
      </div>
    </div>
  );
}
