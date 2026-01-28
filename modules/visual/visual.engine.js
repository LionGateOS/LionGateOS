/*
  LionGateOS — Visual Layer Engine
  Capabilities INCLUDED, OFF by default.

  Provides:
    VisualLayer.setEnabled(bool)
    VisualLayer.setAmbientEnabled(bool)
    VisualLayer.setBordersEnabled(bool)
    VisualLayer.setBordersStyle("off"|"static"|"conic")
    VisualLayer.setGlowEnabled(bool)
    VisualLayer.setMotion(0..1)
    VisualLayer.setReduceMotion(bool)
    VisualLayer.applyPreset(presetObj)

  Activation is controlled via <html> classes and CSS variables.
*/

(function(){
  const KEY = "lg.visual.effects";

  const state = {
    enabled: false,

    ambientEnabled: false,
    ambientStrength: 0.35,
    ambientSpeed: 0.35,

    bordersEnabled: false,
    bordersStyle: "off", // "off" | "static" | "conic"
    bordersThickness: 2, // px
    bordersGlow: 0.35,
    bordersSpeed: 0.35,

    glowEnabled: false,
    glowStrength: 0.35,

    motion: 0.5,
    reduceMotion: false
  };

  function clamp01(n){
    n = Number(n);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(1, n));
  }

  function load(){
    try{
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && typeof saved === "object") Object.assign(state, saved);
    }catch{}
    apply();
  }

  function save(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch{}
  }

  function apply(){
    const root = document.documentElement;

    root.classList.toggle("ve-enabled", !!state.enabled);
    root.classList.toggle("ve-ambient-on", !!state.ambientEnabled);
    root.classList.toggle("ve-borders-on", !!state.bordersEnabled);
    root.classList.toggle("ve-glow-on", !!state.glowEnabled);
    root.classList.toggle("ve-reduce-motion", !!state.reduceMotion);

    root.style.setProperty("--ve-motion-intensity", String(clamp01(state.motion)));

    root.style.setProperty("--ve-ambient-strength", String(clamp01(state.ambientStrength)));
    root.style.setProperty("--ve-ambient-speed", String(clamp01(state.ambientSpeed)));

    root.style.setProperty("--ve-borders-thickness", `${Math.max(1, Number(state.bordersThickness)||2)}px`);
    root.style.setProperty("--ve-borders-glow", String(clamp01(state.bordersGlow)));
    root.style.setProperty("--ve-borders-speed", String(clamp01(state.bordersSpeed)));

    root.style.setProperty("--ve-glow-strength", String(clamp01(state.glowStrength)));

    // Map style to dataset for CSS selectors
    let style = state.bordersStyle;
    if (style !== "static" && style !== "conic") style = "off";
    root.dataset.veBordersStyle = (style === "off") ? "off" : style;

    // Safety: if master disabled, keep subfeatures off (still stored, just not active)
  }

  // --- Public setters ---
  function setEnabled(v){ state.enabled = !!v; apply(); save(); }
  function setAmbientEnabled(v){ state.ambientEnabled = !!v; apply(); save(); }
  function setBordersEnabled(v){ state.bordersEnabled = !!v; apply(); save(); }
  function setGlowEnabled(v){ state.glowEnabled = !!v; apply(); save(); }
  function setReduceMotion(v){ state.reduceMotion = !!v; apply(); save(); }

  function setBordersStyle(style){
    state.bordersStyle = (style === "static" || style === "conic") ? style : "off";
    apply(); save();
  }

  function setMotion(v){ state.motion = clamp01(v); apply(); save(); }

  function setAmbientStrength(v){ state.ambientStrength = clamp01(v); apply(); save(); }
  function setAmbientSpeed(v){ state.ambientSpeed = clamp01(v); apply(); save(); }

  function setBordersThickness(v){ state.bordersThickness = Math.max(1, Number(v)||2); apply(); save(); }
  function setBordersGlow(v){ state.bordersGlow = clamp01(v); apply(); save(); }
  function setBordersSpeed(v){ state.bordersSpeed = clamp01(v); apply(); save(); }

  function setGlowStrength(v){ state.glowStrength = clamp01(v); apply(); save(); }

  function applyPreset(p){
    if (!p || typeof p !== "object") return;
    // Only allow known keys (safety)
    const keys = [
      "enabled","ambientEnabled","ambientStrength","ambientSpeed",
      "bordersEnabled","bordersStyle","bordersThickness","bordersGlow","bordersSpeed",
      "glowEnabled","glowStrength",
      "motion","reduceMotion"
    ];
    for (const k of keys){
      if (k in p) state[k] = p[k];
    }
    apply(); save();
  }

  // --- Compatibility wiring (non-invasive) ---
  // If an Appearance module emits "appearance.change", accept common fields.
  document.addEventListener("appearance.change", (e)=>{
    const d = (e && e.detail) ? e.detail : {};
    // Try multiple naming conventions safely:
    if ("visualsEnabled" in d) setEnabled(!!d.visualsEnabled);
    if ("visualEffectsEnabled" in d) setEnabled(!!d.visualEffectsEnabled);
    if ("veEnabled" in d) setEnabled(!!d.veEnabled);

    if ("ambientEnabled" in d) setAmbientEnabled(!!d.ambientEnabled);
    if ("bordersEnabled" in d) setBordersEnabled(!!d.bordersEnabled);
    if ("glowEnabled" in d) setGlowEnabled(!!d.glowEnabled);

    if ("bordersStyle" in d) setBordersStyle(String(d.bordersStyle));
    if ("motion" in d) setMotion(d.motion);

    if ("reduceMotion" in d) setReduceMotion(!!d.reduceMotion);
  });

  // Optional: expose a minimal getter
  function getState(){ return JSON.parse(JSON.stringify(state)); }

  window.VisualLayer = {
    load,
    apply,
    getState,

    setEnabled,
    setAmbientEnabled,
    setBordersEnabled,
    setBordersStyle,
    setGlowEnabled,
    setMotion,
    setReduceMotion,

    setAmbientStrength,
    setAmbientSpeed,
    setBordersThickness,
    setBordersGlow,
    setBordersSpeed,
    setGlowStrength,

    applyPreset
  };

  document.addEventListener("DOMContentLoaded", load);
})();
