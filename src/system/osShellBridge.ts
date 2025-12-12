import type { ReactNode } from "react";

export interface OSAppIntegration {
  id: string;
  name: string;
  category?: string;
  runsInsideOs: boolean;
  runsStandalone: boolean;
  osSlot?: "workspace" | "dock" | "background";
  path?: string;
  status?: "planned" | "alpha" | "beta" | "stable";
}

export interface OSShellLayoutConfig {
  supportsSidebar: boolean;
  supportsTopBar: boolean;
  supportsDock: boolean;
  supportsMultiAppWorkspaces: boolean;
}

export interface OSThemeIntegrationConfig {
  engineConfigPath: string;
  iconPacksPath: string;
  wallpapersPath: string;
  styleModes: string[];
}

export interface OSShellControllerConfig {
  channel: string;
  description?: string;
  entry?: {
    type: string;
    suggestedRootComponent?: string;
    suggestedHookModule?: string;
  };
  layout: OSShellLayoutConfig;
  themeIntegration: OSThemeIntegrationConfig;
  appsModel?: {
    registryConfigPath: string;
    notes?: string[];
  };
}

export interface OSWorkspaceShellState {
  controller: OSShellControllerConfig;
  apps: OSAppIntegration[];
  styleMode: string;
}

/**
 * Normalize arbitrary controller + app metadata into a strongly typed state
 * object that the UI shell components can consume.
 *
 * This function is intentionally pure and framework-agnostic so it can be
 * reused by both React (Vite) and Electron shells.
 */
export function buildShellState(params: {
  controller: OSShellControllerConfig;
  apps: OSAppIntegration[];
  defaultStyleMode?: string;
}): OSWorkspaceShellState {
  const { controller, apps, defaultStyleMode } = params;

  const styleModes = controller.themeIntegration?.styleModes ?? ["default-frame"];
  const mode = defaultStyleMode && styleModes.includes(defaultStyleMode)
    ? defaultStyleMode
    : styleModes[0];

  return {
    controller,
    apps: apps.slice().sort((a, b) => a.name.localeCompare(b.name)),
    styleMode: mode,
  };
}

/**
 * Lightweight props shape that OS shell React components can use.
 * This is intentionally small so the UI shell can stay simple and stable.
 */
export interface OSWorkspaceShellProps {
  osName: string;
  tagline?: string;
  shellState: OSWorkspaceShellState;
  sidebar?: ReactNode;
  children?: ReactNode;
}
