# INCIDENT_LIFECYCLE_CONTRACT.md

STATUS: GOVERNANCE-ONLY · NON-VISUAL · NON-RUNTIME  
DEPENDS ON: SECURITY_EVENTS_SCHEMA.md, THREAT_CLASSIFICATION_MODEL.md  
CHANGE POLICY: ADDITIVE-ONLY (NO RENAMES, NO DELETES, NO SEMANTIC BREAKS)

---

## 1. Authority and Scope (LOCKED)

This document defines the canonical, OS-level **incident lifecycle** for LionGateOS.
An incident is a governed construct derived from one or more security events and their
threat classifications.

This contract standardizes:
- When an incident is created
- How it progresses through states
- What metadata is required at each state
- How incidents are closed and archived

This document is governance-only and introduces **no runtime behavior**.

---

## 2. Non-Negotiable Principles (LOCKED)

1. **Event-First:** Incidents are derived from immutable security events; events are never altered.
2. **Deterministic State Machine:** Incident state transitions follow a fixed, auditable model.
3. **Additive Evolution:** New states and metadata may be appended only.
4. **Separation of Duties:** Detection, classification, response, and resolution are distinct concerns.
5. **Traceability:** Every incident must be traceable to its originating events and classifications.
6. **Least Disclosure:** Incident records must minimize sensitive data exposure.

---

## 3. Incident Definition (LOCKED)

An **Incident** is a governed aggregation that meets one or more of the following criteria:
- A security event classified with `threat_level = HIGH` or `CRITICAL`
- Multiple correlated events that collectively elevate risk
- An explicit integrity failure or confirmed policy breach
- Manual elevation by authorized review processes

Incidents are identified independently from events and persist beyond individual event lifetimes.

---

## 4. Incident Record (Canonical Metadata)

An incident record MUST contain the following fields:

| Field | Type | Rules |
|---|---|---|
| `incident_id` | string | Globally unique identifier |
| `created_at` | string | ISO-8601 timestamp of incident creation |
| `current_state` | string | One of the lifecycle states in §5 |
| `threat_level` | string | Highest threat level observed |
| `threat_classes` | array | One or more classes involved |
| `escalation_band` | string | Highest band reached |
| `originating_events` | array | List of `event_id` values |
| `correlation_ids` | array | Trace/chain identifiers |
| `review_required` | boolean | Indicates mandatory human review |
| `owner` | string|null | Assigned owner/team identifier |
| `notes` | array | Append-only incident notes |

Incident records are append-only; fields are never removed or overwritten.

---

## 5. Lifecycle States (LOCKED)

The incident lifecycle is a finite state machine with the following canonical states:

1. `DETECTED`  
   - Incident candidate identified
   - Originating events captured
   - No assessment yet completed

2. `TRIAGED`  
   - Initial assessment performed
   - Scope and potential impact estimated
   - False positives may be identified but not yet closed

3. `INVESTIGATING`  
   - Active investigation underway
   - Evidence gathering and correlation in progress

4. `CONTAINED`  
   - Immediate risk mitigated
   - No further damage expected, investigation may continue

5. `RESOLVED`  
   - Root cause addressed
   - No remaining active threat

6. `CLOSED`  
   - Incident formally closed
   - Documentation complete

7. `ARCHIVED`  
   - Incident retained for audit/compliance
   - Read-only, immutable record

States may only progress forward unless explicitly allowed by §6.

---

## 6. State Transition Rules (LOCKED)

Permitted transitions:

- `DETECTED` → `TRIAGED`
- `TRIAGED` → `INVESTIGATING`
- `TRIAGED` → `CLOSED` (false positive)
- `INVESTIGATING` → `CONTAINED`
- `INVESTIGATING` → `RESOLVED`
- `CONTAINED` → `RESOLVED`
- `RESOLVED` → `CLOSED`
- `CLOSED` → `ARCHIVED`

Backward transitions are forbidden.

Each transition MUST:
- Be timestamped
- Identify the actor (user/system)
- Include a rationale code

---

## 7. Severity and Escalation Interaction (LOCKED)

- Incidents inherit the **highest observed threat_level** from contributing classifications.
- Escalation band may increase as new evidence is added.
- Escalation band may decrease only with documented rationale and review.

Threat level reduction does not remove historical classifications.

---

## 8. Evidence and Notes (LOCKED)

### 8.1 Evidence
Evidence references MAY include:
- Event IDs
- Hashes
- External case references
- Forensic artifact identifiers

Raw sensitive payloads MUST NOT be embedded.

### 8.2 Notes
- Notes are append-only
- Each note includes timestamp, author, and type
- Notes may never be edited or deleted

---

## 9. Closure Criteria (LOCKED)

An incident may be marked `CLOSED` only if:
- All active threats are mitigated or disproven
- Required reviews are completed
- Closure rationale is recorded

False positives MUST include explicit justification.

---

## 10. Retention and Archival (LOCKED)

- `ARCHIVED` incidents are immutable
- Retention duration is governed by policy external to this document
- Archived incidents remain discoverable for audit purposes

---

## 11. Non-Goals (LOCKED)

This contract does NOT:
- Define technical remediation steps
- Assign operational tooling
- Automate response actions
- Replace legal or compliance policy

---

## 12. Versioning and Change Control (LOCKED)

- Additive-only evolution
- Existing state meanings must not change
- New states or metadata must not invalidate prior records

---

## 13. Status

This contract is:
- Governance-only
- Non-visual
- Non-runtime
- Deterministic
- Additive-only

END OF DOCUMENT
