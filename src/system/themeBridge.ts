import themeMeta from "../../system/theme-engine/theme-engine.meta.json";

export function getTheme(styleMode) {
  const preset = themeMeta.themePresets.find(p => p.id === styleMode);
  return preset ? preset.palette : themeMeta.themePresets[0].palette;
}
