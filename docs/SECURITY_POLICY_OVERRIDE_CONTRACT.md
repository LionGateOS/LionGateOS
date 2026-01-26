# SECURITY_POLICY_OVERRIDE_CONTRACT.md

STATUS: GOVERNANCE-ONLY · NON-VISUAL · NON-RUNTIME  
DEPENDS ON: SECURITY_EVENTS_SCHEMA.md, THREAT_CLASSIFICATION_MODEL.md, INCIDENT_LIFECYCLE_CONTRACT.md, POST_INCIDENT_REVIEW_CONTRACT.md  
CHANGE POLICY: ADDITIVE-ONLY (NO RENAMES, NO DELETES, NO SEMANTIC BREAKS)

---

## 1. Authority and Scope (LOCKED)

This document defines the canonical, OS-level governance for **temporary security policy overrides** within LionGateOS.

A security policy override is an explicit, time-bound exception to an otherwise enforced security rule.
Overrides exist solely to maintain system continuity under exceptional conditions and must never become routine.

This document is governance-only and introduces **no runtime behavior**.

---

## 2. Non-Negotiable Principles (LOCKED)

1. **Exception, Not Mechanism:** Overrides are exceptional and discouraged.
2. **Explicit Authorization:** No override may exist without formal authorization.
3. **Time-Bound:** Every override must have a defined expiration.
4. **Full Traceability:** All overrides must emit security events and be auditable.
5. **Least Scope:** Overrides must be narrowly scoped to the minimum necessary.
6. **Mandatory Review:** Overrides trigger mandatory post-incident or post-action review.
7. **Additive Evolution:** New override types may be appended only.

---

## 3. Override Eligibility (LOCKED)

An override MAY be considered only if all conditions are met:

- A documented operational necessity exists
- No safer alternative is available in the required timeframe
- The override does not conceal or suppress audit logging
- The override does not bypass integrity verification entirely
- The override is reversible

Overrides MUST NOT be used to:
- Disable security event emission
- Suppress audit records
- Mask confirmed malicious activity
- Circumvent legal or regulatory requirements

---

## 4. Override Types (LOCKED)

Canonical override types include:

1. `TEMPORARY_PERMISSION_ELEVATION`
2. `CONTROL_BYPASS_WITH_LOGGING`
3. `RATE_LIMIT_RELAXATION`
4. `INTEGRATION_GRACE_PERIOD`
5. `EMERGENCY_ACCESS`

No other override types are permitted unless added additively.

---

## 5. Override Record (Canonical Metadata)

Each override MUST have a governed record containing:

| Field | Type | Rules |
|---|---|---|
| `override_id` | string | Globally unique identifier |
| `override_type` | string | One of the types in §4 |
| `created_at` | string | ISO-8601 timestamp |
| `expires_at` | string | ISO-8601 expiration timestamp |
| `status` | string | `ACTIVE`, `EXPIRED`, `REVOKED` |
| `requestor` | string | Role or system requesting override |
| `approver` | string | Authorized approver |
| `scope` | string | Explicit description of affected resources |
| `justification` | string | Documented rationale |
| `risk_assessment` | string | Summary of accepted risk |
| `linked_incident_id` | string|null | Related incident, if any |
| `notes` | array | Append-only notes |

Override records are immutable except for status progression and append-only notes.

---

## 6. Authorization Requirements (LOCKED)

Overrides require:

- Explicit approval by an authorized role
- Dual-authorization for `EMERGENCY_ACCESS` when feasible
- Automatic denial if approval cannot be attributed

Approval identity MUST be recorded and auditable.

---

## 7. Event Emission and Monitoring (LOCKED)

The following events MUST be emitted:

- Override requested
- Override approved or denied
- Override activated
- Override expired or revoked

All such events MUST:
- Conform to `SECURITY_EVENTS_SCHEMA.md`
- Use elevated severity appropriate to risk
- Be correlated to the override and any related incident

---

## 8. Expiration and Revocation (LOCKED)

- Overrides MUST automatically expire at `expires_at`
- Manual revocation MUST be possible at any time
- Expiration or revocation MUST emit security events
- Expired overrides MUST NOT be silently renewed

Renewal requires a new override record.

---

## 9. Mandatory Review (LOCKED)

Every override triggers a mandatory review:

- Linked to an existing PIR if incident-related
- Otherwise, a standalone override review MUST be created
- Review outcomes MAY mandate corrective actions or policy changes

Failure to complete review is a governance violation.

---

## 10. Interaction with Incidents (LOCKED)

- Overrides MAY elevate incident severity
- Overrides during an active incident increase scrutiny
- Overrides do not pause or alter incident lifecycle progression

---

## 11. Non-Goals (LOCKED)

This contract does NOT:
- Authorize permanent security weakening
- Define implementation details
- Replace incident response processes
- Permit undocumented emergency actions

---

## 12. Versioning and Change Control (LOCKED)

- Additive-only evolution
- Existing safeguards may not be weakened
- New override types or rules must not reduce auditability

---

## 13. Status

This contract is:
- Governance-only
- Non-visual
- Non-runtime
- Deterministic
- Additive-only

END OF DOCUMENT
