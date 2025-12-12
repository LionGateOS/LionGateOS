import React from "react";
import { getOsAppIntegrations, OSAppIntegration } from "../../system/appRegistryBridge";

export const SettingsPanel: React.FC = () => {
  const apps: OSAppIntegration[] = getOsAppIntegrations();

  return (
    <>
      <h2>Settings</h2>
      <p className="lgos-text-muted">
        Configure LionGateOS preferences and core system options.
      </p>

      <section aria-label="Application permissions" className="lgos-settings-section">
        <h3>Applications &amp; Permissions</h3>
        <p className="lgos-text-muted">
          Each application runs either as a core system app or inside a sandbox. Permissions tell you
          what the app is allowed to access.
        </p>

        <div className="lgos-app-grid">
          {apps.map((app) => {
            const isSandboxed = app.integration.sandbox;
            const hasPermissions = app.integration.permissions.length > 0;

            return (
              <article
                key={app.id}
                className="lgos-app-permission-card"
                aria-label={`${app.name} permissions`}
              >
                <header className="lgos-app-permission-header">
                  <div>
                    <div className="lgos-app-name">{app.name}</div>
                    <div className="lgos-app-meta-row">
                      <span className="lgos-app-category">{app.category}</span>
                      <span className={`lgos-app-status lgos-app-status-${app.status}`}>
                        {app.status === "stable"
                          ? "Stable"
                          : app.status === "beta"
                          ? "Beta"
                          : "Alpha"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={
                        isSandboxed
                          ? "lgos-badge lgos-badge-sandbox"
                          : "lgos-badge lgos-badge-system"
                      }
                    >
                      {isSandboxed ? "Sandboxed app" : "System app"}
                    </span>
                  </div>
                </header>

                <div className="lgos-app-permission-body">
                  <div className="lgos-permission-label">Permissions</div>
                  {hasPermissions ? (
                    <ul className="lgos-permission-chip-row">
                      {app.integration.permissions.map((perm) => (
                        <li key={perm} className="lgos-permission-chip">
                          {perm === "storage"
                            ? "Storage (local data)"
                            : perm === "network"
                            ? "Network (online access)"
                            : perm}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="lgos-text-muted">No special permissions requested.</div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default SettingsPanel;
