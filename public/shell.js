
// Minimal interactivity: theme pills + launcher toggle
(function () {
  const themePills = document.querySelectorAll(".lgos-pill");
  const body = document.body;
  themePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      themePills.forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      const t = pill.getAttribute("data-theme");
      body.classList.remove("theme-light", "theme-dark", "theme-neon");
      if (t === "light") body.classList.add("theme-light");
      else if (t === "dark") body.classList.add("theme-dark");
      else body.classList.add("theme-neon");
    });
  });

  const launcher = document.getElementById("lgos-launcher");
  const toggle = document.getElementById("lgos-launcher-toggle");
  if (launcher && toggle) {
    toggle.addEventListener("click", () => {
      launcher.classList.toggle("is-open");
    });
  }
})();
