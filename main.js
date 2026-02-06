document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // 1. NAVIGATION REPAIR
  // Maps your "Overview, Calendar, Apps, Notes" tabs to your panels
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach((tab, i) => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');
      
      tab.classList.add('active');
      if(panels[i]) panels[i].style.display = 'block';
      console.log("Navigated to:", tab.innerText);
    };
  });

  // 2. DRAWER & THEME REPAIR
  // Reconnects the Appearance side-panel and the Preset dropdown
  const btnApp = document.getElementById("btnAppearance");
  const drawer = document.getElementById("drawer");
  const closeBtn = document.getElementById("closeDrawerBtn");

  if(btnApp) btnApp.onclick = () => drawer.classList.add("open");
  if(closeBtn) closeBtn.onclick = () => drawer.classList.remove("open");

  const themeSelect = document.querySelector('select');
  if (themeSelect) {
    themeSelect.onchange = (e) => {
      const theme = e.target.value.toLowerCase();
      if(theme.includes('cyber')) { root.style.setProperty('--lg-accent', '#d946ef'); root.style.setProperty('--lg-bg0', '#0f0518'); }
      else if(theme.includes('forest')) { root.style.setProperty('--lg-accent', '#10b981'); root.style.setProperty('--lg-bg0', '#022c22'); }
      else { root.style.setProperty('--lg-accent', '#3b82f6'); root.style.setProperty('--lg-bg0', '#0a0a0c'); }
    };
  }

  // 3. SLIDER REPAIR
  // Re-links the Radius and Glow sliders in the Panel Frames section
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach((s) => {
    s.oninput = (e) => {
      const val = e.target.value;
      const label = s.parentElement.innerText.toLowerCase();
      if (label.includes('radius')) root.style.setProperty('--lg-radius', val + 'px');
      if (label.includes('glow')) root.style.setProperty('--lg-glow-spread', (val/4) + 'px');
    };
  });
});
