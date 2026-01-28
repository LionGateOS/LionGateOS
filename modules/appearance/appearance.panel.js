
/*
 Appearance / Controls Module
 Responsibilities:
 - Render and manage appearance drawer UI
 - Emit appearance changes via custom events
 - Persist preferences (localStorage)
*/

(function(){
  const STORAGE_KEY = "lg.appearance";

  function qs(sel, root=document){ return root.querySelector(sel); }

  function loadState(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function saveState(state){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function applyState(state){
    if (state.accent) {
      document.documentElement.style.setProperty("--lg-accent", state.accent);
    }
    if (state.accent2) {
      document.documentElement.style.setProperty("--lg-accent2", state.accent2);
    }
    document.dispatchEvent(new CustomEvent("appearance.change", { detail: state }));
  }

  function init(){
    const drawer = qs(".drawer");
    if (!drawer) return;

    const state = loadState();
    applyState(state);

    drawer.addEventListener("input", (e)=>{
      const t = e.target;
      if (!t.name) return;
      state[t.name] = t.value;
      applyState(state);
      saveState(state);
    });
  }

  window.AppearanceModule = { init };
})();
