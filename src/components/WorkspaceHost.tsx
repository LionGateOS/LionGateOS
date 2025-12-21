import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { APP_REGISTRY, SYSTEM_REGISTRY } from "../system/appRegistry";
import { setWorkspaceStatus } from "../system/workspaceStatus";

type Bean = {
  id: string;
  key: string;
  title: string;
  route: string;
  createdAt: number;
};

function stableId(key: string, route: string) {
  return `${key}:${route}`;
}

function getRouteDef(pathname: string) {
  const defs = [...SYSTEM_REGISTRY, ...APP_REGISTRY];
  // pick the first whose defaultRoute is a prefix match
  return defs.find((d) => pathname === d.defaultRoute || pathname.startsWith(d.defaultRoute + "/")) ?? null;
}

function markActive(key: string) {
  // Keep it simple: mark all known keys idle, then mark one active.
  for (const a of APP_REGISTRY) setWorkspaceStatus(a.id, "idle");
  for (const s of SYSTEM_REGISTRY) setWorkspaceStatus(s.id, "idle");
  setWorkspaceStatus(key, "active");
}

export default function WorkspaceHost() {
  const location = useLocation();
  const navigate = useNavigate();

  const [beans, setBeans] = useState<Bean[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const lastPathRef = useRef<string>("");

  const current = useMemo(() => getRouteDef(location.pathname), [location.pathname]);

  useEffect(() => {
    if (!current) return;
    if (lastPathRef.current === current.defaultRoute) return;
    lastPathRef.current = current.defaultRoute;

    const id = stableId(current.id, current.defaultRoute);
    const bean: Bean = {
      id,
      key: current.id,
      title: current.name,
      route: current.defaultRoute,
      createdAt: Date.now(),
    };

    setBeans((prev) => {
      const exists = prev.some((b) => b.id === id);
      const next = exists ? prev : [...prev, bean];
      setActiveId(id);
      markActive(current.id);
      return next;
    });
  }, [current]);

  const openWorkspaceByRoute = (route: string) => {
    const defs = [...SYSTEM_REGISTRY, ...APP_REGISTRY];
    const def = defs.find((d) => d.defaultRoute === route) ?? null;
    if (!def) return;

    const id = stableId(def.id, def.defaultRoute);
    const bean: Bean = {
      id,
      key: def.id,
      title: def.name,
      route: def.defaultRoute,
      createdAt: Date.now(),
    };

    setBeans((prev) => {
      const exists = prev.some((b) => b.id === id);
      const next = exists ? prev : [...prev, bean];
      setActiveId(id);
      markActive(def.id);
      return next;
    });

    if (location.pathname !== def.defaultRoute) {
      navigate(def.defaultRoute);
    }
  };

  const activate = (id: string) => {
    const bean = beans.find((b) => b.id === id);
    if (!bean) return;
    setActiveId(id);
    markActive(bean.key);
    navigate(bean.route);
  };

  const close = (id: string) => {
    setBeans((prev) => {
      const next = prev.filter((b) => b.id !== id);
      const closingWasActive = activeId === id;

      if (!closingWasActive) return next;

      const fallback = next[next.length - 1] ?? null;
      if (fallback) {
        setActiveId(fallback.id);
        markActive(fallback.key);
        navigate(fallback.route);
      } else {
        // Always fall back to hub to prevent empty shell.
        setActiveId(null);
        markActive("hub");
        navigate("/hub");
      }
      return next;
    });
  };

  return (
    <div className="lgos-shell" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div
        className="lgos-topbar-beans"
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 12px",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(0,0,0,0.10)",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {beans.map((b) => (
          <div
            key={b.id}
            onClick={() => activate(b.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              cursor: "pointer",
              border: b.id === activeId ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.12)",
              background: b.id === activeId ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.92)",
              userSelect: "none",
            }}
            title={b.route}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: b.id === activeId ? "#22c55e" : "rgba(255,255,255,0.35)",
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{b.title}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close(b.id);
              }}
              aria-label={`Close ${b.title}`}
              style={{
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.70)",
                fontSize: 14,
                lineHeight: 1,
                cursor: "pointer",
                padding: 0,
                marginLeft: 2,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Outlet context={{ openWorkspaceByRoute }} />
      </div>
    </div>
  );
}