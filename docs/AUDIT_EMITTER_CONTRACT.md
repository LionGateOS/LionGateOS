# LionGateOS Audit Emitter Contract (B29)

This document defines the **mandatory contract** for emitting audit, security, access, entitlement, billing, and usage-cap events within LionGateOS.

**Authority:** OS-level, canonical  
**Applies to:** OS Core, all apps (first- and third-party), modules, services, and runtime components  
**Version:** B29

---

## 1. Purpose

LionGateOS is designed to be **auditable without being surveillant**. The OS must be able to answer:

- What happened?
- Why did it happen?
- Who/what initiated it?
- What should the user do next (if anything)?

This contract ensures:
- Consistent event structure across the platform
- Deterministic, explainable denials and state transitions
- Reliable ingestion into **Security Center** and any future audit tooling
- Prevention of app-defined “shadow audit” semantics

---

## 2. Non-Negotiable Rules

### 2.1 OS is the auditing authority
- Apps **emit** events, but the OS defines:
  - The event types (`os:*`)
  - Mandatory fields
  - Severity mapping
  - Retention categories
  - Visibility rules

### 2.2 No silent denials
If an action is blocked or constrained at any layer (account state, entitlement, caps, permissions, runtime), an audit event **must** be emitted.

### 2.3 No app-defined audit semantics
Apps must not:
- Create custom event taxonomies that imitate OS audit categories
- Re-label denials or severity
- Hide, suppress, or “aggregate away” denials

Apps may emit **app-internal diagnostics** only if:
- They do not use the `os:*` namespace
- They are not presented as security/audit truth
- They do not contain sensitive user content

---

## 3. Event Transport

### 3.1 Primary channel
- Events are emitted via the **OS message bus**.
- The authoritative namespace is `os:*`.

### 3.2 Delivery expectations
- Events must be emitted **synchronously** with the decision outcome whenever feasible.
- If emitted asynchronously, the emitter must ensure:
  - No loss on crash
  - Reasonable ordering guarantees per `correlationId`

---

## 4. Canonical Event Envelope (Required)

Every `os:*` event MUST conform to the following envelope.

### 4.1 Required top-level fields

- `type` *(string)*  
  Must begin with `os:`.

- `timestamp` *(number)*  
  UNIX epoch milliseconds.

- `appId` *(string)*  
  The caller/initiator app/module ID. Must match registry IDs where applicable.

- `kind` *(string)*  
  Category-specific discriminator (examples: `granted`, `denied`, `state-change`, `hit`, `warning`).

- `severity` *(string)*  
  One of: `info`, `warning`, `alert`.  
  **Apps must not invent new severities.**

- `reason` *(string)*  
  Plain-language rationale. Must be human-readable and suitable for Security Center.

### 4.2 Optional but strongly recommended fields

- `featureId` *(string)*  
  When a feature gate is involved (entitlement/caps/access).

- `accountState` *(string)*  
  One of: `Guest`, `Free`, `Founder`, `Pro`, `Commercial`, `Grace`, `Suspended`, `Canceled`.

- `requiredTier` *(string)*  
  When a tier gate is involved.

- `permission` *(string)*  
  When a permission gate is involved (e.g., `storage`, `network`).

- `capRef` *(string)*  
  When a cap gate is involved.

- `correlationId` *(string)*  
  For linking multi-step flows (install/update/export/etc.).

- `resourceRef` *(string)*  
  Minimal identifier (never raw content) for the target object (e.g., `export:job:123`).

- `actor` *(object)*  
  Minimal initiator descriptor:
  - `type`: `user` | `system` | `app`
  - `id`: optional stable identifier when allowed

---

## 5. Payload Standards

### 5.1 “Reason” requirements (mandatory)
The `reason` must:
- Use plain language
- Avoid technical jargon
- Never blame the user
- Include a next step when user action is possible

Examples of acceptable reasons:
- “You’ve reached your export limit for this month.”
- “This feature requires Pro access.”
- “Network access is blocked for this app by policy.”
- “Your subscription payment failed. You are in a grace period.”

### 5.2 “No surveillance” boundaries
Events must not include:
- Raw document contents
- Full transaction descriptions
- Personal sensitive data (PII, PHI)
- Full file paths that reveal user environment

If a reference is needed, use `resourceRef` or hashed identifiers.

---

## 6. Event Families (Normative)

Event types must use OS-defined families. The following are the canonical families introduced through B29 governance.

### 6.1 Access & Entitlement
- `os:access:granted`
- `os:access:denied`
- `os:entitlement:granted`
- `os:entitlement:denied`

Minimum required fields:
- `appId`, `timestamp`, `severity`, `reason`, `kind`
Recommended:
- `featureId`, `accountState`, `requiredTier`, `correlationId`

### 6.2 Caps & Usage Limits
- `os:cap:warning`
- `os:cap:hit`
- `os:cap:reset`

Minimum required fields:
- `capRef`, `appId`, `timestamp`, `severity`, `reason`, `kind`
Recommended:
- `accountState`, `window`, `limit`, `currentUsage`, `correlationId`

### 6.3 Billing & Account Lifecycle
- `os:billing:state-change`
- `os:billing:grace-start`
- `os:billing:grace-end`
- `os:billing:suspended`
- `os:billing:recovered`

Minimum required fields:
- `timestamp`, `severity`, `reason`, `kind`
Recommended:
- `previousState`, `newState`, `effectiveAt`, `accountState`, `correlationId`

### 6.4 Security & Abuse Signals
- `os:security:permission`
- `os:security:rate-limit`
- `os:security:anomaly`

Minimum required fields:
- `appId`, `timestamp`, `severity`, `reason`, `kind`
Recommended:
- `permission`, `capRef`, `accountState`, `correlationId`

### 6.5 Install / Update / Rollback
- `os:install:started`
- `os:install:completed`
- `os:install:failed`
- `os:install:rolled-back`
- `os:update:available`
- `os:update:started`
- `os:update:completed`
- `os:update:failed`
- `os:update:rolled-back`

Minimum required fields:
- `timestamp`, `severity`, `reason`, `kind`
Recommended:
- `packageId`, `version`, `correlationId`

### 6.6 Exports
- `os:export:requested`
- `os:export:completed`
- `os:export:failed`

Minimum required fields:
- `appId`, `timestamp`, `severity`, `reason`, `kind`
Recommended:
- `resourceRef`, `format`, `correlationId`

---

## 7. Idempotency, Deduplication, and Ordering

### 7.1 Idempotency
If the same action is attempted multiple times (e.g., retry), emit distinct events with unique `correlationId` values unless the OS explicitly deduplicates.

### 7.2 Deduplication hints
Emitters may include:
- `dedupeKey` *(string)*: stable key for short-window collapse
- `dedupeWindowMs` *(number)*: suggested collapse window

The OS may ignore these fields.

### 7.3 Ordering expectations
- Emitters should preserve ordering within a `correlationId` flow when feasible.
- Cross-flow ordering is not guaranteed.

---

## 8. Visibility Contract (Security Center Consumption)

Events are categorized for user visibility. The OS remains the final authority, but emitters must follow these rules:

### 8.1 User-visible by default
- Denials (access, entitlement, permission)
- Cap hits
- Billing state changes
- Security anomalies

### 8.2 Internal-only by default
- Normal telemetry
- Successful grants (unless needed for debugging views)

Emitters must still emit the event even if it is internal-only.

---

## 9. Prohibited Patterns

Emitters must never:
- Emit `os:*` events with missing required fields
- Emit “denied” events without `reason`
- Change `severity` to manipulate UI behavior
- Use fear/urgency language (“Your account is at risk!”) unless explicitly OS-authorized
- Leak sensitive data into `reason` or payload

---

## 10. Example Envelopes (Illustrative, Contract-Compliant)

> These examples show structure only; they are not exhaustive.

### 10.1 Entitlement denied
```json
{
  "type": "os:entitlement:denied",
  "timestamp": 1735516800000,
  "appId": "rows",
  "featureId": "rows.export",
  "accountState": "Free",
  "requiredTier": "Pro",
  "kind": "denied",
  "severity": "warning",
  "reason": "This export requires Pro access.",
  "correlationId": "c-8f1e0b1b"
}
```

### 10.2 Cap hit
```json
{
  "type": "os:cap:hit",
  "timestamp": 1735516800000,
  "appId": "budget",
  "capRef": "exports.monthly",
  "accountState": "Founder",
  "kind": "hit",
  "severity": "warning",
  "reason": "You’ve reached your export limit for this month.",
  "correlationId": "c-27c9b2aa"
}
```

### 10.3 Billing grace start
```json
{
  "type": "os:billing:grace-start",
  "timestamp": 1735516800000,
  "kind": "state-change",
  "severity": "warning",
  "reason": "Your subscription payment failed. You are in a grace period.",
  "previousState": "Pro",
  "newState": "Grace",
  "effectiveAt": 1735516800000,
  "correlationId": "c-5b1b2e90"
}
```

---

## 11. Relationship to Other Policies

This contract is subordinate to:
- `docs/SECURITY_AUDIT_AND_TELEMETRY.md`
- `docs/PERMISSIONS.md`
- `docs/ACCOUNTS_AND_BILLING.md`

If a conflict is detected, OS policy documents override this contract.

---

## 12. Versioning & Change Control

- Initial version: **B29**
- Changes to this contract require:
  - Explicit user authorization
  - Additive-only updates unless controlled cleanup is authorized
  - A descriptive Git commit message
