import registry from "../../system/app-registry/os-app-registry.json";

export type OSSandboxPermission = "storage" | "network";

export interface OSAppIntegration {
  id: string;
  name: string;
  category: string;
  status: "alpha" | "beta" | "stable";
  runsInsideOs: boolean;
  runsStandalone: boolean;
  integration: {
    osSlot: "workspace";
    path: string;
    sandbox: boolean;
    permissions: OSSandboxPermission[];
  };
}

interface OSAppRegistry {
  version: string;
  apps: OSAppIntegration[];
}

const typedRegistry = registry as OSAppRegistry;

export function getOsAppIntegrations(): OSAppIntegration[] {
  return typedRegistry.apps;
}
