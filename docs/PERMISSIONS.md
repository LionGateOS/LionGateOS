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

---

## User Account States (OS-Level Policy)

LionGateOS enforces user-facing access through explicit account states. These states are evaluated by the OS before app capabilities are exercised.

**Account States:**
- **Guest (Logged-Out):** No persistence; limited, session-only actions.
- **Free (Logged-In):** Identity and persistence enabled with strict usage caps.
- **Founder (Logged-In, One-Time Entitlement):** Permanent personal-use entitlement.
- **Pro (Subscription):** Enhanced personal-use limits and features.
- **Commercial (Organization-Based):** Business use with seats and administrative controls.
- **Grace Period:** Temporary access after payment failure.
- **Suspended:** Read-only access after grace expiration.
- **Canceled:** Access until end of paid period; no renewal.

The OS must resolve the active account state prior to evaluating entitlements.

## Subscription Lifecycle Enforcement

The OS enforces subscription state transitions as a first-class policy layer:

- **Start:** Immediate entitlement upon successful purchase.
- **Upgrade:** Immediate entitlement elevation.
- **Downgrade:** Effective at period end.
- **Payment Failure:** Transition to Grace Period.
- **Grace Expiry:** Transition to Suspended.
- **Recovery:** Restoration upon successful payment.

No app may bypass lifecycle enforcement.

## Tier Entitlements (Free / Founder / Pro / Commercial)

Entitlements are evaluated independently of runtime permissions:

- **Free:** Limited ingestion, exports, and cross-app actions.
- **Founder:** Permanent personal-use entitlement; commercial use prohibited.
- **Pro:** Higher limits and automation for personal workflows.
- **Commercial:** Organization features, seats, client workflows, APIs.

If entitlement evaluation fails, the OS must deny the action before invoking runtime permissions.

## Cross-App Access Rules

Cross-app data flow is governed by OS policy:

- **ROWS → Budget:** Requires logged-in state.
- **Budget → Travels:** Requires Budget data presence or paid tier.
- **Calendar:** Non-revenue OS glue; respects account state.

Apps must request cross-app actions via OS mediation.

## Launcher Visibility Rules

App visibility in the OS launcher is policy-driven:

- **Guest:** Marketing tiles and demos only.
- **Logged-In:** Visibility based on entitlements and contextual relevance.
- **Travels:** Activated upon qualifying Budget context or paid tier.

Visibility does not imply entitlement.

## Relationship Between Permission Engine and Entitlement Policy

The Permission Engine enforces **what an app may do** at runtime.
The Entitlement Policy enforces **whether a user is allowed** to initiate that action.

**Evaluation Order (Mandatory):**
1. Account State
2. Entitlement Policy
3. Permission Engine
4. Runtime Execution

If any layer denies the request, the action must not proceed.

## Policy Audit & Observability

All entitlement denials and cross-app policy decisions must emit auditable events aligned with existing message bus conventions to ensure transparency and diagnosability.

---

## Usage Caps & Limits (Numeric, Enforced by OS)

All limits below are enforced by the OS prior to runtime permission checks. Limits reset on a rolling 30-day window unless otherwise specified.

### ROWS — Ingestion & Export Limits

**Guest (Logged-Out):**
- Document ingestions: **1 per session**
- Pages per document: **5**
- Rows emitted: **100**
- Exports: **1**, watermarked, no re-download
- Persistence: **None**

**Free (Logged-In):**
- Document ingestions: **5 / month**
- Pages per document: **20**
- Rows emitted: **1,000 / month**
- Exports: **5 / month**
- Persistence: **Enabled**

**Founder (Personal Use):**
- Document ingestions: **100 / month**
- Pages per document: **100**
- Rows emitted: **25,000 / month**
- Exports: **Unlimited (personal use)**
- Persistence: **Enabled**
- Commercial processing: **Prohibited**

**Pro (Personal Subscription):**
- Document ingestions: **300 / month**
- Pages per document: **200**
- Rows emitted: **100,000 / month**
- Exports: **Unlimited**
- Persistence: **Enabled**

**Commercial (Organization):**
- Document ingestions: **Configurable per contract**
- Pages per document: **Configurable**
- Rows emitted: **Configurable**
- Exports: **Unlimited**
- API access: **Enabled**
- Seats: **Enforced**

### Budget — Data & Planning Limits

**Free:**
- Active workspaces: **1**
- Imported datasets: **3**
- Planning modules: **Basic only**
- Sheets sync: **Read-only**

**Founder:**
- Active workspaces: **1**
- Imported datasets: **Unlimited**
- Planning modules: **All personal**
- Sheets sync: **Full**

**Pro:**
- Active workspaces: **3**
- Imported datasets: **Unlimited**
- Planning modules: **All**
- Sheets sync: **Full**

**Commercial:**
- Active workspaces: **Per organization**
- Imported datasets: **Unlimited**
- Planning modules: **All**
- Sheets sync: **Full + shared**

### Travels — Planning Limits

**Free:**
- Trips: **1 active**
- Scenarios: **Basic**

**Founder / Pro:**
- Trips: **Unlimited**
- Scenarios: **Advanced**

**Commercial:**
- Trips: **Unlimited**
- Shared itineraries: **Enabled**

### Calendar — Engagement Limits

- Calendar access is available to all logged-in users.
- No monetized limits apply.

## Limit Enforcement & Abuse Protection

- Exceeding limits must result in **graceful denial** with clear upgrade messaging.
- Sustained overages may trigger **re-attestation of use type** (personal vs commercial).
- Abuse or circumvention attempts may result in **temporary suspension** subject to review.

