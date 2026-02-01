document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // 1. RE-LINK TABS (Overview, Calendar, Apps, Notes)
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach((tab, i) => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      if (panels[i]) panels[i].style.display = 'block';
    };
  });

  // 2. STYLES (Neon vs Glass)
  const styleSelect = document.querySelector('select[id*="Style"]') || document.querySelector('select:nth-of-type(2)');
  if (styleSelect) {
    styleSelect.onchange = (e) => {
      const style = e.target.value.toLowerCase();
      if (style.includes('neon')) {
        root.style.setProperty('--lg-panel-bg', 'rgba(255, 255, 255, 0.02)');
        root.style.setProperty('--lg-panel-border', '1px solid var(--lg-accent)');
      } else {
        root.style.setProperty('--lg-panel-bg', 'rgba(255, 255, 255, 0.05)');
        root.style.setProperty('--lg-panel-border', '1px solid rgba(255, 255, 255, 0.1)');
      }
    };
  }

  // 3. SLIDERS (Radius, Intensity, Glow)
  document.addEventListener("input", (e) => {
    if (e.target.type === 'range') {
      const val = e.target.value;
      const label = e.target.closest('div')?.innerText.toLowerCase() || "";
      
      if (label.includes('radius')) root.style.setProperty('--lg-radius', val + 'px');
      if (label.includes('intensity')) root.style.setProperty('--lg-glow-opacity', val / 100);
      if (label.includes('glow')) root.style.setProperty('--lg-glow-spread', (val / 2) + 'px');
      if (label.includes('opacity')) root.style.setProperty('--lg-bg-opacity', val / 100);
    }
  });

  // 4. BACKGROUND FIX (URL & Upload)
  const bgInput = document.querySelector('input[type="file"]');
  const bgUrlInput = document.querySelector('input[placeholder*="URL"]');
  
  if (bgInput) {
    bgInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        document.body.style.backgroundImage = `url('${url}')`;
        document.body.style.backgroundSize = "cover";
      }
    };
  }
  if (bgUrlInput) {
    bgUrlInput.oninput = (e) => {
      document.body.style.backgroundImage = `url('${e.target.value}')`;
      document.body.style.backgroundSize = "cover";
    };
  }

  // 5. APPEARANCE DRAWER
  const btnApp = document.getElementById("btnAppearance");
  const drawer = document.getElementById("drawer");
  if(btnApp) btnApp.onclick = () => drawer.classList.add("open");
});