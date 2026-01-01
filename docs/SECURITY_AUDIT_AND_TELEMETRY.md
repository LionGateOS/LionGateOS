# LionGateOS Security, Audit & Telemetry Policy (B29)

This document defines the authoritative OS-level policy for security events,
audit logging, telemetry emission, alerting, and retention across LionGateOS.

It applies to all apps, modules, and runtime components without exception.

---

## Scope & Authority

- Single source of truth for **security, audit, and telemetry behavior**
- Applies uniformly across:
  - OS Core
  - App Registry
  - Permission Engine
  - Billing & Account State
  - All installed apps
- Supersedes any app-level logging assumptions

Apps emit events via the OS.  
Apps must not invent their own audit semantics.

---

## Design Principles

- **Visibility over silence**
- **Explainability over automation**
- **Auditability without surveillance**
- **User trust as a first-class concern**

All denials, limits, and state changes must be explainable to the user.

---

## Mandatory Event Categories

All events are emitted on the OS message bus.

### 1. Access & Entitlement Events

**Event Types**
- `os:access:granted`
- `os:access:denied`
- `os:entitlement:granted`
- `os:entitlement:denied`

**Emitted When**
- App launch gating
- Feature invocation gating
- Cross-app access checks

**Required Payload**
- `appId`
- `featureId` (if applicable)
- `accountState`
- `requiredTier`
- `decision` (`granted` | `denied`)
- `reason`
- `timestamp`

---

### 2. Caps & Usage Limits

**Event Types**
- `os:cap:warning`
- `os:cap:hit`
- `os:cap:reset`

**Emitted When**
- A feature references a `capRef`
- Usage approaches a limit
- Usage reaches or exceeds a limit
- A rolling window resets

**Required Payload**
- `capRef`
- `appId`
- `accountState`
- `window`
- `limit`
- `currentUsage`
- `timestamp`

---

### 3. Billing & Account Lifecycle

**Event Types**
- `os:billing:state-change`
- `os:billing:grace-start`
- `os:billing:grace-end`
- `os:billing:suspended`
- `os:billing:recovered`

**Required Payload**
- `previousState`
- `newState`
- `effectiveAt`
- `reason`

Billing events are authoritative and must not be inferred by apps.

---

### 4. Security & Abuse Signals

**Event Types**
- `os:security:permission`
- `os:security:rate-limit`
- `os:security:anomaly`

**Required Payload**
- `appId`
- `permission` (if applicable)
- `kind`
- `severity`
- `timestamp`

---

## Retention Policy

Retention is enforced by the OS.

- **Security & Billing Events:** 24 months
- **Access & Entitlement Events:** 12 months
- **Warnings & Telemetry:** 90 days

No app may reduce retention.

---

## Visibility Rules

### User-Visible (Security Center)
- Access denials
- Entitlement denials
- Cap hits
- Billing state changes
- Security alerts

### Internal-Only
- Successful access grants
- Normal usage telemetry
- Non-actionable events

---

## Alert Thresholds

- Repeated access denials (same feature): **Warn**
- Repeated cap hits (rolling window): **Notify**
- Security anomalies: **Immediate alert**
- Billing failures: **Notify + persistent banner**

Alert severity is OS-defined and immutable by apps.

---

## Relationship to Other OS Policies

**Evaluation Order (Mandatory)**
1. Account State (`ACCOUNTS_AND_BILLING.md`)
2. Entitlement Policy (`PERMISSIONS.md`)
3. App Registry (`os-app-registry.json`)
4. Permission Engine
5. Runtime Execution
6. Audit & Telemetry Emission (this document)

If an action is denied at any layer, an audit event must be emitted.

---

## Security Center UI Consumption Rules (B29)

This section defines how the **Security Center** consumes, groups, and presents
events emitted under this policy.

### UI Objectives
- Calm, non-alarming presentation
- Clear explanation of **what happened**, **why**, and **what to do next**
- Zero technical jargon in user-facing views

---

### Event Intake & Normalization

- Consume events exclusively from the OS message bus (`os:*`)
- Deduplicate identical events within a short window
- Collapse repeated warnings into a single incident with counters
- Preserve raw events for audit views without loss of fidelity

---

### Primary UI Sections

#### 1. Overview
- Current account state (Active / Grace / Suspended)
- Active alerts (count by severity)
- Recent critical events (last 24 hours)

#### 2. Alerts & Incidents
Displays **actionable** items only:
- Security anomalies
- Repeated access denials
- Repeated cap hits
- Billing failures

Each incident must show:
- Plain-language summary
- Affected app(s)
- Time window
- Recommended action (upgrade, retry, contact support)

#### 3. Activity Log (User-Facing)
Shows:
- Access denials
- Entitlement denials
- Cap hits
- Billing state changes

Each entry includes:
- App name
- Feature name (if applicable)
- Human-readable reason
- Timestamp
- Link to relevant policy explanation

#### 4. Audit Log (Advanced)
- Full-fidelity, read-only view
- Time-range and app filters
- Exportable where permitted by account tier

---

### Severity Mapping (Immutable)

| Event Type | UI Severity |
|----------|-------------|
| `os:access:denied` | Warning |
| `os:entitlement:denied` | Warning |
| `os:cap:hit` | Warning |
| `os:cap:warning` | Info |
| `os:billing:grace-start` | Warning |
| `os:billing:suspended` | Alert |
| `os:security:anomaly` | Alert |

Apps may not override severity mapping.

---

### Messaging Rules

- No blame or alarmist language
- Always include **reason** and **next step**
- If user action is required, present **one clear CTA**

Examples:
- “You’ve reached your export limit for this month.”
- “Your subscription payment failed. You’re in a grace period.”

---

## Versioning

- Initial version: **B29**
- Changes require:
  - Explicit authorization
  - Additive-only updates
  - Git commit with descriptive message
