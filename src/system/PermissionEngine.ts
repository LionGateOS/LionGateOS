import { publish } from "./MessageBus";
import {
  getOsAppIntegrations,
  type OSAppIntegration,
  type OSSandboxPermission,
} from "./appRegistryBridge";

export type PermissionEngineEventKind =
  | "granted"
  | "denied"
  | "unknown-app";

export interface PermissionEngineEvent {
  kind: PermissionEngineEventKind;
  appId: string;
  permission: OSSandboxPermission;
  timestamp: number;
  reason?: string;
}

const appsById: Map<string, OSAppIntegration> = new Map(
  getOsAppIntegrations().map((app) => [app.id, app]),
);

/**
 * Look up an app integration by ID from the OS registry.
 */
export function getAppById(appId: string): OSAppIntegration | undefined {
  return appsById.get(appId);
}

/**
 * Returns true if the app is registered as sandboxed.
 */
export function isSandboxedApp(appId: string): boolean {
  const app = getAppById(appId);
  return !!app?.integration.sandbox;
}

/**
 * Returns the declared permissions for an app.
 */
export function getDeclaredPermissions(
  appId: string,
): OSSandboxPermission[] {
  const app = getAppById(appId);
  return app?.integration.permissions ?? [];
}

function emit(event: PermissionEngineEvent): void {
  publish({
    type: "os:security:permission",
    source: "PermissionEngine",
    payload: event,
  });
}

/**
 * Check whether a given app has a specific permission.
 * Does not throw; only returns a boolean.
 */
export function hasPermission(
  appId: string,
  permission: OSSandboxPermission,
): boolean {
  const app = getAppById(appId);
  if (!app) {
    return false;
  }

  const allowed = app.integration.permissions.includes(permission);

  emit({
    kind: allowed ? "granted" : "denied",
    appId,
    permission,
    timestamp: Date.now(),
    reason: allowed
      ? "Permission present in app registry."
      : "Permission not declared in app registry.",
  });

  return allowed;
}

/**
 * Enforce that an app has a permission. If the permission is missing
 * or the app is unknown, this will throw an Error.
 */
export function assertPermission(
  appId: string,
  permission: OSSandboxPermission,
): void {
  const app = getAppById(appId);

  if (!app) {
    const event: PermissionEngineEvent = {
      kind: "unknown-app",
      appId,
      permission,
      timestamp: Date.now(),
      reason: "App ID is not present in the OS app registry.",
    };
    emit(event);
    throw new Error(
      `[PermissionEngine] Unknown app: "${appId}" is not registered in the OS registry.`,
    );
  }

  if (!app.integration.permissions.includes(permission)) {
    const event: PermissionEngineEvent = {
      kind: "denied",
      appId,
      permission,
      timestamp: Date.now(),
      reason: `App "${app.name}" does not declare "${permission}" permission.`,
    };
    emit(event);
    throw new Error(
      `[PermissionEngine] Permission denied: "${appId}" is not allowed to use "${permission}".`,
    );
  }

  const event: PermissionEngineEvent = {
    kind: "granted",
    appId,
    permission,
    timestamp: Date.now(),
    reason: `App "${app.name}" is allowed to use "${permission}".`,
  };
  emit(event);
}

/**
 * Utility wrapper for async operations that require a specific permission.
 * If the permission is not granted, the inner operation is never executed.
 */
export async function withPermission<T>(
  appId: string,
  permission: OSSandboxPermission,
  operation: () => Promise<T>,
): Promise<T> {
  assertPermission(appId, permission);
  return operation();
}
