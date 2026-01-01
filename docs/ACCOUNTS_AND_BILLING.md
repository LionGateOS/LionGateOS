# LionGateOS Accounts & Billing (B25)

This document defines the OS-level accounts, billing, and subscription contract for LionGateOS.
It is authoritative for how payment events change account state and entitlements across all apps.

This document is policy-focused. Apps consume the resulting OS state and must not implement billing logic independently.

---

## Scope & Authority

- Single source of truth for **accounts, billing, subscriptions, and monetization**
- Applies to **all LionGateOS apps** without exception
- Supersedes any app-level billing assumptions

Apps must read OS state; they must not infer billing status.

---

## Account Types

### User Accounts
- Individual identities with personal entitlements

### Organization Accounts
- Commercial entities with seats and administrative controls
- Created and governed by the OS upon Commercial subscription activation

---

## Account States (Authoritative)

Account state is resolved by the OS and evaluated before entitlements or runtime permissions.

- **Guest (Logged-Out):** No persistence; demo and limited session actions only
- **Free (Logged-In):** Identity and persistence with strict usage caps
- **Founder (Logged-In, One-Time Entitlement):** Permanent personal-use entitlement
- **Pro (Subscription):** Enhanced personal-use access
- **Commercial (Organization-Based):** Business use with seats and org controls
- **Grace Period:** Temporary access after payment failure
- **Suspended:** Read-only access after grace expiry
- **Canceled:** Access until end of paid period; no renewal

---

## Subscription Types

### One-Time Entitlement
- **Founder**
- No renewal
- No expiration
- Personal use only
- Non-transferable
- Revocable only for abuse or policy violation

### Recurring Subscriptions
- **Pro (Personal)**
- **Commercial (Organization)**

Each recurring subscription includes:
- Billing interval (monthly or annual)
- Renewal date
- Grace window
- Cancellation effective date

---

## Payment Provider Contract (OS-Level)

- The OS integrates with **one primary payment provider**
- The provider handles:
  - Payment methods
  - Invoicing
  - Taxes/VAT
  - Charge lifecycle
- The OS handles:
  - Account state transitions
  - Entitlement enforcement
  - Audit events

**Rule:** Apps must never communicate directly with the payment provider.

---

## Lifecycle Mapping (Payment → OS State)

### Successful Payment
- OS state transitions to **Active**
- Entitlements granted immediately

### Renewal Upcoming
- No state change
- Notification only

### Payment Failure
- OS state transitions to **Grace Period**
- Entitlements remain temporarily active

### Grace Expiry
- OS state transitions to **Suspended**
- Enforcement:
  - No ingestion
  - No exports
  - Read-only access where applicable

### Payment Recovery
- OS state transitions to **Active**
- Full entitlements restored immediately

### Cancellation (User-Initiated)
- OS state transitions to **Canceled**
- Entitlements remain until period end
- No auto-renewal

---

## Refunds, Chargebacks, and Disputes

### Refunds (Voluntary)
- Immediate downgrade:
  - Pro → Free
  - Commercial → Org Disabled
- Access removed immediately
- Data retained; no deletion

### Chargebacks / Disputes
- Immediate transition to **Suspended**
- Flagged for manual review
- Repeated abuse may permanently revoke entitlements

**Founder purchases are non-refundable** by default unless legally required.

---

## Trials (Explicit Policy)

- **No time-based trials**
- Free tier and ROWS public entry serve as the trial experience
- Prevents trial abuse and billing edge cases

Any future trials must be OS-defined and documented here.

---

## Commercial Organizations & Seats

- Commercial subscriptions create an **Organization**
- Organization includes:
  - Owner
  - Seats
  - Members
- Seat limits are enforced by the OS
- Removing a member:
  - Revokes entitlements immediately
  - Preserves data under the organization

---

## Webhooks & State Transitions

- Payment provider webhooks are the **only input** that may change billing state
- The OS must:
  - Validate webhook authenticity
  - Translate events into deterministic state transitions
  - Emit audit events for all changes

Apps must treat OS state as final.

---

## User-Facing Guarantees

- No silent downgrades
- No surprise deletions
- Clear messaging for:
  - Grace Period
  - Suspension
  - Recovery
- Data export must be available before any permanent removal (if ever)

---

## Relationship to Permissions & Entitlements

Evaluation order is mandatory:

1. Account State (this document)
2. Entitlement Policy (PERMISSIONS.md)
3. Permission Engine (runtime)
4. Execution

If any layer denies the request, the action must not proceed.

---

## Versioning

- Initial version: **B25**
- Changes to this document require explicit authorization and additive-only updates
