# LionGateOS Permission Engine (B25)

This document describes the system-level permission enforcement layer introduced in build **B25**.

## Overview

The Permission Engine is responsible for:

- Reading application metadata from `system/app-registry/os-app-registry.json`.
- Evaluating whether an app is allowed to use a given capability (e.g., `storage`, `network`).
- Emitting security events on the OS message bus whenever a permission is granted or denied.
- Providing a simple API that other modules can call to enforce permissions at runtime.

## Core API

The engine is implemented in `src/system/PermissionEngine.ts` and exposes:

- `getAppById(appId)` – look up an app from the registry.
- `isSandboxedApp(appId)` – whether the app is marked as sandboxed.
- `getDeclaredPermissions(appId)` – read the list of declared permissions.
- `hasPermission(appId, permission)` – returns a boolean, and emits an audit event.
- `assertPermission(appId, permission)` – throws if the permission is not allowed.
- `withPermission(appId, permission, operation)` – helper wrapper for async work.

## Message Bus Integration

All permission checks emit an event via `src/system/MessageBus.ts` with type:

- `type: "os:security:permission"`

The payload includes:

- `kind` – `"granted" | "denied" | "unknown-app"`
- `appId` – the caller ID
- `permission` – the capability being requested
- `timestamp` – UNIX epoch (ms)
- `reason` – human-readable rationale

Future builds can subscribe to these events to power:

- Security dashboards
- Live system log views
- Alerting and anomaly detection

## Registry Version

The app registry version has been updated to:

- `b25-permission-core-1`

This signals that the OS now has a permission-aware runtime layer.
