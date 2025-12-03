import React from "react";
import "../theme/neonshell.theme.css";
import SplashGate from "../splash/SplashGate";
import { TOP_NAV_ITEMS, BOTTOM_NAV_ITEMS } from "../../components/AppRegistry";
import { NavItemRenderer } from "../../components/NavItemRenderer";

export const AppShellWrapper: React.FC = () => {
  const activeId = "overview";

  const shell = (
    <div className="lgos-shell">
      <header className="lgos-topbar">
        <div className="lgos-topbar__left">
          <div className="lgos-topbar__title">LionGateOS</div>
          <div className="lgos-topbar__subtitle">NeonShell · Workspace OS</div>
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
              <span className="lgos-sidebar__brand-title-main">LIONGATEOS</span>
              <span className="lgos-sidebar__brand-title-sub">
                NeonShell Environment
              </span>
            </div>
          </div>

          <nav className="lgos-sidebar__nav">
            <div className="lgos-sidebar__nav-top">
              <div className="lgos-nav-header">Workspace</div>
              <div className="lgos-nav-list">
                {TOP_NAV_ITEMS.map((item) => (
                  <NavItemRenderer
                    key={item.id}
                    item={item}
                    isActive={item.id === activeId}
                  />
                ))}
              </div>
            </div>

            <div className="lgos-sidebar__nav-bottom">
              <div className="lgos-nav-header">System</div>
              <div className="lgos-nav-list">
                {BOTTOM_NAV_ITEMS.map((item) => (
                  <NavItemRenderer
                    key={item.id}
                    item={item}
                    isActive={item.id === activeId}
                  />
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <section className="lgos-workspace">
          <div className="lgos-workspace__inner">
            <div className="lgos-workspace__placeholder">
              <h2>System Overview</h2>
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
