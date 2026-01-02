# LionGateOS Registry Enforcement Contract (B29)

This document defines the authoritative OS-level **contract** for validating, versioning, and enforcing the LionGateOS App Registry.

**Authority:** OS-level, canonical  
**Applies to:** OS Core, App Loader, Permission Engine, Billing/Entitlements layer, and all apps  
**Primary Registry File:** `system/app-registry/os-app-registry.json`  
**Version:** B29

---

## 1. Purpose

The App Registry is the OS’s single source of truth for:

- App identity (`appId`)
- Integration path and OS slot (`integration.path`, `integration.osSlot`)
- Sandboxing mode (`integration.sandbox`)
- Declared permissions (`integration.permissions`)
- Access rules and account-state gating (`access`)
- Feature entitlements (`features`)
- Registry-level evaluation order and default behaviors (`registryPolicy`)

This contract ensures:
- Deterministic enforcement across the platform
- Safe, auditable gating decisions
- Fail-closed behavior on ambiguity or corruption
- Prevention of apps “self-declaring” privileges at runtime

---

## 2. Enforcement Authority & Non-Negotiables

### 2.1 OS is the registry authority
- The OS is the only enforcement authority for registry policy.
- Apps must not override registry fields at runtime.

### 2.2 Fail-closed is mandatory
If the registry is missing, corrupted, unreadable, or fails validation:
- Default behavior is **deny** for privileged operations
- OS may permit **Home** or a minimal “safe shell” only if explicitly allowed by OS policy

### 2.3 No silent denial
If the OS denies or constrains an action due to registry enforcement, the OS must emit an audit event per:
- `docs/SECURITY_AUDIT_AND_TELEMETRY.md`
- `docs/AUDIT_EMITTER_CONTRACT.md`

---

## 3. Registry Structure Requirements (Normative)

The registry MUST contain:

- `version` *(string)*  
  A registry version identifier (e.g., `b29-security-center-ui-1`).

- `apps` *(array)*  
  A list of app entries with unique IDs.

Optionally, the registry may contain:
- `registryPolicy` *(object)*

### 3.1 App entry required fields (minimum)
Each app MUST include:
- `id` *(string)* — unique, stable appId
- `name` *(string)* — display name
- `category` *(string)*
- `runsInsideOs` *(boolean)*
- `runsStandalone` *(boolean)*
- `integration` *(object)* with:
  - `osSlot` *(string)* (e.g., `workspace`)
  - `path` *(string)* (route segment or loader path)
  - `sandbox` *(boolean)*
  - `permissions` *(array of string)*

If an app declares `access` rules (recommended), it must include:
- `access.requiresLogin` *(boolean)*
- `access.minAccountState` *(string)*
- `access.allowedStates` *(array of string)*
- `access.behaviorByState` *(object, optional)*

If an app declares `features` (recommended), it must include:
- `features` *(array)* of `{ id, requiredTier }`

---

## 4. Validation Rules

### 4.1 Uniqueness & identity
- `apps[].id` MUST be unique across the registry.
- IDs must be stable and lowercase-safe (recommended), but OS policy defines strictness.

### 4.2 Integration fields
- `integration.path` MUST be non-empty.
- `integration.osSlot` MUST be recognized by OS loader.
- If `runsInsideOs` is false, OS loader must not mount the app internally.

### 4.3 Sandbox semantics
- If `integration.sandbox` is true, the app is treated as sandboxed for:
  - permission enforcement
  - cross-app access boundaries
  - any OS-defined isolation constraints

### 4.4 Permissions declaration
- All permissions are declared under `integration.permissions`.
- Unknown permission identifiers are invalid unless OS explicitly supports them.
- Permissions are enforced via Permission Engine contract.

### 4.5 Access rules
If `access` is present:
- `minAccountState` must be a known state
- `allowedStates` must include `minAccountState`
- If `requiresLogin` is true, `Guest` must not be allowed unless OS policy allows it

### 4.6 Features
If `features` is present:
- `features[].id` must be unique within the app
- `features[].requiredTier` must be a recognized tier

---

## 5. Registry Evaluation Order (Normative)

The OS must evaluate access to an app or feature in a deterministic order.

If `registryPolicy.evaluationOrder` exists, the OS MUST follow it.

Recommended canonical order:
1. **Account State**
2. **Entitlement Policy**
3. **App Registry**
4. **Permission Engine**
5. **Runtime Execution**
6. **Audit & Telemetry Emission**

If any layer denies an action, the action must not proceed and must emit an audit event.

---

## 6. Default Behaviors for Account States

If `registryPolicy.defaultBehaviors` is present, it defines OS behavior when account state is:

- `Grace`
- `Suspended`
- `Canceled`

### 6.1 Fail-closed defaults
If a default behavior is missing for a state, OS must:
- deny privileged actions (e.g., ingestion, exports)
- default to read-only where safe

### 6.2 App-specific overrides
Apps may provide `access.behaviorByState`, but:
- RegistryPolicy defaults remain authoritative where they are stricter
- Apps cannot loosen OS-defined deny modes

---

## 7. Enforcement Outcomes & Required Audit Events

### 7.1 Registry validation failure
If registry fails validation:
- OS must emit: `os:security:anomaly` (or OS-defined equivalent)
- Reason must be plain language:
  - “The app registry could not be validated, so access is restricted.”

### 7.2 App not found
If an appId is requested but not in registry:
- OS must deny and emit:
  - `os:access:denied` (if launch)
  - and/or `os:security:permission` / `os:security:anomaly` as appropriate

### 7.3 Access denied by state/tier
If denied due to account state or tier:
- Emit `os:access:denied` and/or `os:entitlement:denied`
- Reason must include a next step if applicable (upgrade, renew, contact support)

---

## 8. Compatibility & Version-Gating

### 8.1 Registry version string
- `version` indicates the schema/policy generation.
- OS may refuse to load registry versions it does not recognize.

### 8.2 Backward compatibility
If OS supports multiple registry versions, it must:
- Validate against the correct schema per `version`
- Fail closed if schema mapping is uncertain

---

## 9. Prohibited Patterns

The following are forbidden:
- Apps granting themselves permissions not declared in registry
- Apps modifying `access` or `features` at runtime
- Apps emitting fake `os:*` registry enforcement events
- Registry entries with ambiguous or missing required fields being treated as “best effort”

---

## 10. Change Control

- Initial version: **B29**
- Updates require:
  - Explicit authorization
  - Additive-only updates unless controlled cleanup is authorized
  - Descriptive Git commit message

