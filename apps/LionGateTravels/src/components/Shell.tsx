import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/", label: "Start" },
  { to: "/trips", label: "Trips" },
  { to: "/quotes", label: "Quotes" },
  { to: "/clients", label: "Clients" },
  { to: "/tasks", label: "Tasks" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  return (
    <div className="to-shell">
      <aside className="to-sidebar">
        <div className="to-brand">
          <div className="to-brand-mark" aria-hidden="true" />
          <div className="to-brand-text">
            <div className="to-brand-title">LionGate Travels</div>
            <div className="to-brand-sub">Test Mode</div>
          </div>
        </div>

        <nav className="to-nav" aria-label="Primary">
          {NAV.map((n) => {
            const active = loc.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={"to-nav-item" + (active ? " to-nav-item-active" : "")}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="to-sidebar-footer">
          <span className="to-status-dot" aria-hidden="true" />
          <span className="to-status-text">ONLINE</span>
        </div>
      </aside>

      <div className="to-content">
        <header className="to-topbar">
          <div className="to-topbar-title">LionGate Travels</div>
          <div className="to-topbar-right">
            <button className="to-ghost-btn" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Back to top
            </button>
          </div>
        </header>

        <div className="to-content-inner">{children}</div>
      </div>
    </div>
  );
}
