import React from "react";
import "../theme/neonshell.theme.css";
import SplashGate from "../splash/SplashGate";

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "System Overview" },
  { id: "workspaces", label: "Workspaces" },
  { id: "theme", label: "Theme Engine" },
];

export const AppShellWrapper: React.FC = () => {
  const activeId = "overview";

  const shell = (
    <div className="lgos-shell">
      <header className="lgos-topbar">
        <div className="lgos-topbar__left">
          <div className="lgos-topbar__title">Workspace</div>
          <div className="lgos-topbar__subtitle">
            LionGateOS · NeonShell Dark Frost
          </div>
        </div>
        <div className="lgos-topbar__right">
          <div className="lgos-topbar__chip">
            <span className="lgos-topbar__chip-dot" />
            <span className="lgos-topbar__chip-label">light-royal-glow</span>
          </div>
        </div>
      </header>

      <div className="lgos-shell-layout">
        <aside className="lgos-sidebar">
          <div className="lgos-sidebar__brand">
            <div className="lgos-sidebar__brand-logo" />
            <div className="lgos-sidebar__brand-title">
              <div className="lgos-sidebar__brand-title-main">LIONGATEOS</div>
              <div className="lgos-sidebar__brand-title-sub">Shell · Neon Core</div>
            </div>
          </div>

          <nav className="lgos-sidebar__nav">
            <div className="lgos-nav-header">Navigation</div>
            <div className="lgos-nav-list">
              {NAV_ITEMS.map((item) => {
                const isActive = item.id === activeId;
                const classes = ["lgos-nav-softsquare"];
                if (isActive) classes.push("lgos-nav-softsquare--active");

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={classes.join(" ")}
                  >
                    <div className="lgos-nav-icon" />
                    <span className="lgos-nav-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <section className="lgos-workspace">
          <div className="lgos-workspace__inner">
            <div className="lgos-workspace__placeholder">
              <p className="lgos-text-muted">
                LionGateOS NeonShell is ready. Open apps and workspaces will appear as
                floating panels here.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return <SplashGate>{shell}</SplashGate>;
};

export default AppShellWrapper;