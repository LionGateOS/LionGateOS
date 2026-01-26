# THREAT_CLASSIFICATION_MODEL.md

STATUS: GOVERNANCE-ONLY · NON-VISUAL · NON-RUNTIME  
DEPENDS ON: SECURITY_EVENTS_SCHEMA.md  
CHANGE POLICY: ADDITIVE-ONLY (NO RENAMES, NO DELETES, NO SEMANTIC BREAKS)

---

## 1. Authority and Scope (LOCKED)

This document defines the canonical, OS-level model for **interpreting security events** into threat classes, risk bands, and escalation states within LionGateOS.

It consumes events that strictly conform to `SECURITY_EVENTS_SCHEMA.md` and provides:
- Deterministic threat classification
- Consistent escalation semantics
- A shared vocabulary for response planning and audit review

This document is governance-only and introduces **no runtime behavior**.

---

## 2. Non-Negotiable Principles (LOCKED)

1. **Schema-First:** Classification consumes events as emitted; it does not mutate events.
2. **Additive Evolution:** New classes and rules may be appended only.
3. **Determinism:** Given the same inputs, classification must yield the same outputs.
4. **Separation of Concerns:** Classification is distinct from response execution.
5. **Explainability:** Each classification must be traceable to explicit rules.
6. **Fail-Safe Bias:** Ambiguity escalates conservatively.

---

## 3. Inputs (LOCKED)

Classification operates on the following immutable inputs from the event envelope:

- `category`
- `event_name`
- `severity`
- `confidence`
- `outcome.status`
- `source.app_id`, `source.module_id`
- `actor.type`
- `subject.type`, `subject.classification`, `subject.pii`
- `boundary.*` (if present)
- Correlation context (`trace_id`, `chain_id`, parent relationships)
- Integrity indicators (hash/signature validity, sequence gaps)

No other inputs are permitted.

---

## 4. Threat Levels (LOCKED)

Threat Level represents **operational risk posture**, not certainty of compromise.

| Level | Code | Definition |
|---|---|---|
| Level 0 | `NONE` | Benign, expected security-relevant activity |
| Level 1 | `LOW` | Unusual but low-risk; monitor only |
| Level 2 | `ELEVATED` | Suspicious; warrants review or correlation |
| Level 3 | `HIGH` | Likely malicious or high-impact misconfiguration |
| Level 4 | `CRITICAL` | Confirmed breach or imminent harm |

Threat Level is independent of event `severity` and `confidence`.

---

## 5. Threat Classes (LOCKED)

Threat Class describes **what kind of risk** is represented.

Canonical classes:

1. `AUTH_ABUSE`
2. `PRIVILEGE_MISUSE`
3. `DATA_EXPOSURE`
4. `CONFIG_TAMPERING`
5. `INTEGRATION_RISK`
6. `AI_MISUSE`
7. `INTEGRITY_FAILURE`
8. `ANOMALOUS_BEHAVIOR`
9. `POLICY_VIOLATION`
10. `AUDIT_PIPELINE_FAILURE`

No other classes are permitted unless added additively.

---

## 6. Classification Outputs (LOCKED)

A classification result MUST contain:

| Field | Type | Rules |
|---|---|---|
| `threat_level` | string | One of the levels in §4 |
| `threat_class` | string | One of the classes in §5 |
| `rationale_codes` | array | One or more stable rule identifiers |
| `escalation_band` | string | One of the bands in §7 |
| `confidence_adjustment` | string | `UP`, `DOWN`, or `NONE` |
| `review_required` | boolean | Whether human review is required |

Outputs are metadata derived from events; they do not alter events.

---

## 7. Escalation Bands (LOCKED)

Escalation Band defines **expected handling urgency**, not the response itself.

| Band | Definition |
|---|---|
| `NONE` | No action beyond logging |
| `MONITOR` | Passive monitoring / trend analysis |
| `REVIEW` | Human or automated review recommended |
| `INVESTIGATE` | Active investigation required |
| `IMMEDIATE` | Immediate response required |

---

## 8. Canonical Classification Rules (BASELINE)

Rules are evaluated in order. First matching rule applies unless otherwise stated.

### 8.1 AUTH Abuse

- IF `category = AUTH`
- AND repeated failures or anomalous patterns detected
- THEN `threat_class = AUTH_ABUSE`

Default mappings:
- Severity `INFO` + Confidence `HIGH` → Level 0 / Band NONE
- Severity `LOW` or `MEDIUM` → Level 1–2 / Band MONITOR or REVIEW
- Severity `HIGH` or `CRITICAL` → Level 3–4 / Band INVESTIGATE or IMMEDIATE

### 8.2 Privilege Misuse

- IF `category = PERMISSION`
- AND `outcome.status IN (DENY, ERROR)`
- AND target classification is `CONFIDENTIAL` or `RESTRICTED`
- THEN `threat_class = PRIVILEGE_MISUSE`

### 8.3 Data Exposure Risk

- IF `category = DATA_ACCESS`
- AND (`subject.classification = RESTRICTED` OR `subject.pii = true`)
- THEN `threat_class = DATA_EXPOSURE`

### 8.4 Configuration Tampering

- IF `category = CONFIG_CHANGE`
- AND change affects security, logging, or key references
- THEN `threat_class = CONFIG_TAMPERING`

### 8.5 Integration Risk

- IF `category = INTEGRATION`
- AND failure, deny, or unexpected external behavior detected
- THEN `threat_class = INTEGRATION_RISK`

### 8.6 AI Misuse

- IF `category = AI_ACTION`
- AND action touches permissions, registry, exports, or restricted data
- THEN `threat_class = AI_MISUSE`

### 8.7 Integrity Failure

- IF integrity validation fails OR sequence gaps detected
- THEN `threat_class = INTEGRITY_FAILURE`
- Default `threat_level = CRITICAL`
- Default `escalation_band = IMMEDIATE`

### 8.8 Policy Violation

- IF `outcome.status = DENY`
- AND reason is policy-based
- THEN `threat_class = POLICY_VIOLATION`

### 8.9 Audit Pipeline Failure

- IF `category = AUDIT_SYSTEM`
- AND emitter health degrades or events drop
- THEN `threat_class = AUDIT_PIPELINE_FAILURE`

---

## 9. Confidence Adjustment Rules (LOCKED)

Confidence Adjustment modifies how aggressively a classification escalates.

- `UP` if:
  - Multiple corroborating events in same `chain_id`
  - Integrity checks succeed with high confidence
- `DOWN` if:
  - Single weak signal
  - Known benign automation pattern
- `NONE` otherwise

Adjustment affects escalation band, not raw threat level.

---

## 10. Correlation Amplification (LOCKED)

Multiple related events MAY amplify classification:

- Same `actor.id` + same `subject.id` across a short window
- Cross-category sequences (e.g., AUTH → PERMISSION → DATA_ACCESS)
- AI_ACTION followed by DATA_ACCESS on restricted data

Amplification may:
- Increase `threat_level` by one band
- Upgrade `escalation_band`

Amplification rules must be explicit and additive.

---

## 11. Non-Goals (LOCKED)

This document does NOT:
- Define response playbooks
- Trigger alerts or enforcement
- Perform scoring, ML inference, or heuristics beyond stated rules
- Replace human judgment

---

## 12. Versioning and Change Control (LOCKED)

- This model evolves additively only.
- Existing rule semantics must not change.
- New rules must include unique `rationale_codes`.
- Deprecated rules may be marked but not removed.

---

## 13. Status

This contract is:
- Governance-only
- Non-visual
- Non-runtime
- Deterministic
- Additive-only

END OF DOCUMENT
