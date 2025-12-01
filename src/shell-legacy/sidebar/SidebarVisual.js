// SidebarVisual component placeholder
// Hybrid macOS + KDE style: glass interior panel with neon outline.
// Visible placeholders: time/date, system metrics, user avatar.
// Vertical layout with hover feedback hooks.

export function SidebarVisual() {
  // Placeholder layout only; logic and data wiring will be added later.
  return (
    <aside className="lgos-sidebar lgos-glass lgos-neon-border">
      <div className="lgos-sidebar-section lgos-sidebar-header">
        <div className="lgos-sidebar-time-placeholder">00:00</div>
        <div className="lgos-sidebar-date-placeholder">Day, Month 00</div>
      </div>
      <div className="lgos-sidebar-section lgos-sidebar-metrics">
        <div className="lgos-metric">CPU: --%</div>
        <div className="lgos-metric">RAM: --%</div>
        <div className="lgos-metric">Storage: --%</div>
      </div>
      <div className="lgos-sidebar-section lgos-sidebar-user">
        <div className="lgos-avatar-placeholder" />
        <div className="lgos-username-placeholder">User</div>
      </div>
    </aside>
  );
}
