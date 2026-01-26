# POST_INCIDENT_REVIEW_CONTRACT.md

STATUS: GOVERNANCE-ONLY · NON-VISUAL · NON-RUNTIME  
DEPENDS ON: INCIDENT_LIFECYCLE_CONTRACT.md  
CHANGE POLICY: ADDITIVE-ONLY (NO RENAMES, NO DELETES, NO SEMANTIC BREAKS)

---

## 1. Authority and Scope (LOCKED)

This document defines the canonical, OS-level requirements for **post-incident review (PIR)** within LionGateOS.

A Post-Incident Review is a mandatory governance activity following the closure of qualifying incidents.
It exists to ensure institutional learning, accountability, and systemic improvement without assigning blame.

This document is governance-only and introduces **no runtime behavior**.

---

## 2. Non-Negotiable Principles (LOCKED)

1. **Learning Over Blame:** PIRs exist to improve systems, not assign fault.
2. **Mandatory for Material Incidents:** Certain incidents require PIR by default.
3. **Append-Only Record:** PIR artifacts are immutable once finalized.
4. **Traceability:** PIRs must reference incidents, events, and decisions.
5. **Action-Oriented:** PIRs must result in corrective or preventive actions.
6. **Additive Evolution:** New review fields may be appended only.

---

## 3. PIR Eligibility Criteria (LOCKED)

A Post-Incident Review MUST be conducted if any of the following apply:

- Incident `threat_level = HIGH` or `CRITICAL`
- Incident involved `DATA_EXPOSURE`, `INTEGRITY_FAILURE`, or `PRIVILEGE_MISUSE`
- Incident required `IMMEDIATE` escalation
- Incident impacted multiple tenants or external integrations
- PIR is explicitly requested by governance or compliance processes

Lower-severity incidents MAY optionally undergo PIR.

---

## 4. PIR Record (Canonical Metadata)

A PIR record MUST contain:

| Field | Type | Rules |
|---|---|---|
| `pir_id` | string | Globally unique identifier |
| `incident_id` | string | Referenced incident |
| `created_at` | string | ISO-8601 timestamp |
| `completed_at` | string|null | Completion timestamp |
| `review_scope` | string | Brief description of scope |
| `participants` | array | Roles or identifiers (not personal data) |
| `summary` | string | High-level summary |
| `root_causes` | array | One or more identified causes |
| `contributing_factors` | array | Supporting factors |
| `what_worked` | array | Controls or responses that worked |
| `what_failed` | array | Gaps or failures |
| `corrective_actions` | array | Required actions (see §5) |
| `preventive_actions` | array | Preventive measures |
| `approvals` | array | Governance approvals |
| `notes` | array | Append-only notes |

PIR records are immutable after completion.

---

## 5. Corrective and Preventive Actions (LOCKED)

Each action MUST include:

| Field | Description |
|---|---|
| `action_id` | Stable identifier |
| `type` | `CORRECTIVE` or `PREVENTIVE` |
| `description` | Clear, actionable statement |
| `owner` | Responsible role/team |
| `priority` | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `due_by` | Target completion date |
| `status` | `OPEN`, `IN_PROGRESS`, `COMPLETED`, `DEFERRED` |

Actions are tracked independently but referenced by PIRs.

---

## 6. Governance Feedback Loop (LOCKED)

PIR outcomes MAY require updates to:
- Security event taxonomy
- Threat classification rules
- Incident lifecycle thresholds
- Trust boundary policies
- Documentation or training

Required governance changes MUST follow additive-only rules and be explicitly linked back to the PIR.

---

## 7. Finalization and Approval (LOCKED)

A PIR is considered complete only when:
- All required fields are populated
- Corrective and preventive actions are identified
- Required approvals are recorded

After completion:
- The PIR record becomes immutable
- Only append-only notes may be added

---

## 8. Non-Goals (LOCKED)

This contract does NOT:
- Define HR or disciplinary processes
- Mandate specific tools or templates
- Automate action enforcement
- Replace legal or regulatory review

---

## 9. Versioning and Change Control (LOCKED)

- Additive-only evolution
- Existing PIR requirements may not be weakened
- New fields or triggers may be appended only

---

## 10. Status

This contract is:
- Governance-only
- Non-visual
- Non-runtime
- Deterministic
- Additive-only

END OF DOCUMENT
