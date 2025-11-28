// LionGateOS Shell v2 · Hybrid Desktop JS

(function () {
  const body = document.body;
  const dock = document.querySelector("[data-lgos-dock]");
  const tooltip = document.querySelector("[data-lgos-dock-tooltip]");
  const dockItems = dock ? Array.from(dock.querySelectorAll(".lgos-dock-item")) : [];
  const windows = Array.from(document.querySelectorAll(".lgos-window"));
  const navItems = Array.from(document.querySelectorAll(".lgos-nav-item"));
  const themePills = Array.from(document.querySelectorAll(".lgos-theme-pill"));

  function setActiveWindow(id) {
    windows.forEach(w => {
      if (w.getAttribute("data-window") === id) {
        w.classList.add("is-active");
      } else {
        w.classList.remove("is-active");
      }
    });
  }

  function setActiveNav(id) {
    navItems.forEach(item => {
      const target = item.getAttribute("data-window-target");
      if (target === id) {
        item.classList.add("is-active");
      } else {
        item.classList.remove("is-active");
      }
    });
  }

  // Nav click -> switch window
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-window-target");
      if (!target) return;
      setActiveWindow(target);
      setActiveNav(target);
      dockItems.forEach(d => {
        const dt = d.getAttribute("data-window-target");
        if (dt === target) d.classList.add("is-active");
        else d.classList.remove("is-active");
      });
    });
  });

  // Theme switching
  themePills.forEach(pill => {
    pill.addEventListener("click", () => {
      themePills.forEach(p => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      const t = pill.getAttribute("data-theme");
      body.classList.remove("theme-light", "theme-dark", "theme-neon");
      if (t === "light") body.classList.add("theme-light");
      else if (t === "dark") body.classList.add("theme-dark");
      else body.classList.add("theme-neon");
    });
  });

  if (!dock) return;

  // Dock magnification
  const maxScale = 1.32;
  const minScale = 1.0;
  const influence = 110;

  function updateScales(clientX) {
    const rect = dock.getBoundingClientRect();
    const x = clientX - rect.left;

    let closestItem = null;
    let closestDist = Infinity;

    dockItems.forEach(item => {
      const r = item.getBoundingClientRect();
      const center = r.left - rect.left + r.width / 2;
      const dist = Math.abs(x - center);
      if (dist < closestDist) {
        closestDist = dist;
        closestItem = item;
      }
      const ratio = Math.min(dist / influence, 1);
      const scale = minScale + (maxScale - minScale) * Math.pow(1 - ratio, 2);
      item.style.setProperty("--lgos-dock-scale", scale.toFixed(3));
    });

    if (closestItem && tooltip) {
      const label = closestItem.getAttribute("data-label") || "";
      if (label) {
        const ir = closestItem.getBoundingClientRect();
        const center = ir.left + ir.width / 2;
        tooltip.textContent = label.toUpperCase();
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translateX(-50%) translateY(0)";
        tooltip.style.left = center + "px";
      }
    }
  }

  dock.addEventListener("mousemove", e => {
    updateScales(e.clientX);
  });

  dock.addEventListener("mouseleave", () => {
    dockItems.forEach(item => {
      item.style.setProperty("--lgos-dock-scale", "1");
    });
    if (tooltip) {
      tooltip.style.opacity = "0";
      tooltip.style.transform = "translateX(-50%) translateY(6px)";
    }
  });

  // Dock click -> bounce + switch window
  dockItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-window-target");
      if (target) {
        setActiveWindow(target);
        setActiveNav(target);
      }
      dockItems.forEach(d => d.classList.remove("is-active"));
      item.classList.add("is-active");

      item.classList.remove("is-bouncing");
      void item.offsetWidth;
      item.classList.add("is-bouncing");
      item.addEventListener("animationend", () => {
        item.classList.remove("is-bouncing");
      }, { once: true });
    });
  });

  // Initial state
  setActiveWindow("hub");
})();