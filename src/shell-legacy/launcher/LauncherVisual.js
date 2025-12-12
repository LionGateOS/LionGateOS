// LauncherVisual component placeholder
// Hybrid layout:
// - Search bar at top
// - Categories on the left
// - App grid in the center
// Glass + neon background container.

export function LauncherVisualPlaceholder() {
  return (
    <div className="lgos-launcher lgos-glass lgos-launcher-neon">
      <div className="lgos-launcher-header">
        <input
          className="lgos-launcher-search"
          placeholder="Search apps..."
          readOnly
        />
      </div>
      <div className="lgos-launcher-body">
        <nav className="lgos-launcher-categories">
          <div className="lgos-launcher-category is-active">All</div>
          <div className="lgos-launcher-category">Productivity</div>
          <div className="lgos-launcher-category">Construction</div>
          <div className="lgos-launcher-category">AI Tools</div>
        </nav>
        <section className="lgos-launcher-grid">
          <div className="lgos-launcher-app-card">App A</div>
          <div className="lgos-launcher-app-card">App B</div>
          <div className="lgos-launcher-app-card">App C</div>
        </section>
      </div>
    </div>
  );
}
