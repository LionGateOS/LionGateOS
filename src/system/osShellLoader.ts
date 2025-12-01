import { getTheme } from "./themeBridge";
import osManifest from "../../system/shell-baseline/os-manifest.shell-baseline.json";

export function loadShellState() {
  const styleMode = osManifest.defaultStyleMode || "soft-slate-os-default";
  const theme = getTheme(styleMode);

  return {
    styleMode,
    theme,
    controller: {
      layout: {
        supportsSidebar: true
      }
    }
  };
}
