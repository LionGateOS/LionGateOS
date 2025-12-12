import { getTheme } from "./themeBridge";
import { getOsAppIntegrations } from "./appRegistryBridge";
import osManifest from "../../system/shell-baseline/os-manifest.shell-baseline.json";

export function loadShellState() {
  const styleMode = osManifest.defaultStyleMode || "soft-slate-os-default";
  const theme = getTheme(styleMode);
  const apps = getOsAppIntegrations();

  return {
    styleMode,
    theme,
    controller: {
      layout: {
        supportsSidebar: true,
      },
    },
    apps,
  };
}
