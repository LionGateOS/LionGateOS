# LionGateOS Permission Engine Contract (B29)

This document defines the authoritative **contract** for the LionGateOS Permission Engine: how permissions are declared, evaluated, enforced, and audited.

**Authority:** OS-level, canonical  
**Applies to:** OS Core, all apps (first- and third-party), modules, services, and runtime components  
**Version:** B29

---

## 1. Purpose

The Permission Engine exists to ensure that capability access (e.g., `storage`, `network`) is:

- **Deterministic** (same inputs → same decision)
- **Explainable** (every denial has a clear reason)
- **Auditable** (every check emits an OS event)
- **Sandbox-aware** (sandboxed apps cannot exceed declared scope)
- **Registry-backed** (decisions trace to `os-app-registry.json`)

This contract prevents apps from directly invoking sensitive capabilities without OS mediation.

---

## 2. Inputs (Authoritative Sources)

The Permission Engine evaluates permissions using only these authoritative sources:

1. **App Registry**: `system/app-registry/os-app-registry.json`
   - App identity (`appId`)
   - Sandbox flag
   - Declared permissions list

2. **OS Policy Documents** (governance)
   - `docs/PERMISSIONS.md`
   - `docs/SECURITY_AUDIT_AND_TELEMETRY.md`
   - `docs/AUDIT_EMITTER_CONTRACT.md`
   - `docs/ACCOUNTS_AND_BILLING.md` (when account state affects runtime access)

If any source is missing or unreadable, the engine must fail **closed**.

---

## 3. Declared Permissions Model

### 3.1 Declaration location
Apps must declare permissions in the app registry under:

- `integration.permissions: string[]`

Example:
```json
"permissions": ["storage", "network"]
```

### 3.2 Permission identifiers
Permission names are OS-defined capability IDs. Examples:
- `storage`
- `network`

Apps may not invent new permission identifiers without OS registry extension.

---

## 4. Core API Contract (Normative)

The Permission Engine exposes the following OS-level API surface:

- `getAppById(appId)`
- `isSandboxedApp(appId)`
- `getDeclaredPermissions(appId)`
- `hasPermission(appId, permission)`
- `assertPermission(appId, permission)`
- `withPermission(appId, permission, operation)`

### 4.1 `getAppById(appId)`
- Returns the registry entry for `appId`, or `null` if not found.
- Must not throw for unknown apps.

### 4.2 `isSandboxedApp(appId)`
- Returns `true` if registry marks app as sandboxed; otherwise `false`.
- Unknown apps return `true` (fail closed).

### 4.3 `getDeclaredPermissions(appId)`
- Returns the declared permission list.
- Unknown apps return an empty list.

### 4.4 `hasPermission(appId, permission)`
- Returns boolean decision: allowed or denied.
- Must always emit an `os:security:permission` event (see Section 6).

### 4.5 `assertPermission(appId, permission)`
- If denied, throws an OS-defined error type (or a standard Error) that includes:
  - `appId`
  - `permission`
  - denial `reason`
- Must also emit `os:security:permission` (same as `hasPermission`).

### 4.6 `withPermission(appId, permission, operation)`
- Evaluates permission first.
- If allowed, executes `operation`.
- If denied, fails closed and does not execute `operation`.
- Must emit `os:security:permission`.

---

## 5. Decision Rules (Fail-Closed)

### 5.1 Unknown app
If `appId` is not found in registry:
- Deny permission
- Emit `kind: "unknown-app"`
- Severity: `alert` (or `warning` if OS later chooses), per OS mapping

### 5.2 Declared permissions
If `permission` is not listed in `integration.permissions`:
- Deny permission
- Emit `kind: "denied"`
- Reason must identify missing declaration

### 5.3 Sandboxed apps
Sandboxing is an enforcement mode:
- A sandboxed app may only use **declared** permissions.
- A non-sandboxed app may still be denied if not declared (OS policy may require declaration universally).

### 5.4 Policy overrides
If OS policy denies a permission regardless of declaration (e.g., policy-based lockout), deny and emit:
- `kind: "denied"`
- reason identifies the policy layer

---

## 6. Mandatory Audit Emission

Every permission check MUST emit an event on the OS message bus:

- `type: "os:security:permission"`

This must comply with:
- `docs/SECURITY_AUDIT_AND_TELEMETRY.md`
- `docs/AUDIT_EMITTER_CONTRACT.md`

### 6.1 Required event payload fields
- `appId`
- `permission`
- `timestamp` (epoch ms)
- `kind`: `"granted" | "denied" | "unknown-app"`
- `severity`: `info | warning | alert` (OS-defined mapping)
- `reason`: human-readable explanation

### 6.2 Reason requirements
The reason must:
- Be plain-language
- Avoid jargon
- Not include sensitive data
- Explain what would make it granted (if applicable)

Examples:
- “Network access is not declared for this app.”
- “This app is not registered with LionGateOS.”
- “Storage permission granted.”

---

## 7. Error Handling & Safety

### 7.1 Fail closed
If the registry or policy layer cannot be read:
- Deny
- Emit an alert-level event
- Reason: “Permission check failed because the registry could not be read.”

### 7.2 No partial success
The engine must not:
- Grant by default
- “Assume” permissions
- Cache a grant beyond the lifecycle of the requesting operation unless OS policy explicitly allows it

### 7.3 Stability guarantee
Permission results must not change during a single operation execution unless:
- The registry is updated via an OS-authorized update mechanism, or
- Account state changes require reevaluation (OS policy dependent)

---

## 8. Relationship to Account State & Entitlements

The Permission Engine is a **capability gate**, not a tier gate.

However:
- If OS policy requires account-state restrictions on permission usage (e.g., `network` only for paid tiers), the engine must consult the OS entitlement layer **before** granting.

When account state affects permission access, the engine must:
- Deny as appropriate
- Emit the permission event with reason referencing account state / entitlement policy
- Emit any additional `os:access:*` or `os:entitlement:*` events per OS rules (handled by the entitlement layer)

---

## 9. Prohibited Patterns

Apps and modules must never:
- Access a sensitive capability without invoking the Permission Engine (or OS-approved wrapper)
- Emit fake `os:security:permission` events
- Downgrade severity or suppress denied events
- Embed sensitive data in permission reasons

---

## 10. Versioning & Change Control

- Initial version: **B29**
- Updates require:
  - Explicit user authorization
  - Additive-only updates unless controlled cleanup is authorized
  - Descriptive Git commit message

