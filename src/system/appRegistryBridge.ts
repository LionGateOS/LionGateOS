import type { OSAppIntegration } from "./osShellBridge";

export interface AppRegistryEntry {
  id: string;
  name: string;
  category?: string;
  status?: "planned" | "alpha" | "beta" | "stable";
  runsInsideOs: boolean;
  runsStandalone: boolean;
  integration?: {
    osSlot?: "workspace" | "dock" | "background";
    path?: string;
    notes?: string[];
  };
}

export interface AppRegistryMeta {
  description?: string;
  apps: AppRegistryEntry[];
  notes?: string[];
}

/**
 * Normalize app registry metadata into the OSAppIntegration shape consumed
 * by the shell state and UI.
 */
export function toOSAppIntegrations(meta: AppRegistryMeta): OSAppIntegration[] {
  return meta.apps.map((entry) => ({
    id: entry.id,
    name: entry.name,
    category: entry.category,
    runsInsideOs: entry.runsInsideOs,
    runsStandalone: entry.runsStandalone,
    osSlot: entry.integration?.osSlot ?? "workspace",
    path: entry.integration?.path,
    status: entry.status,
  }));
}

/**
 * Convenience filter for apps that can be rendered inside the OS workspace.
 */
export function filterWorkspaceApps(apps: OSAppIntegration[]): OSAppIntegration[] {
  return apps.filter((app) => app.runsInsideOs && (app.osSlot ?? "workspace") === "workspace");
}
