# GOVERNANCE_INDEX.md

STATUS: GOVERNANCE-ONLY · NON-VISUAL · NON-RUNTIME  
APPLIES TO: ALL LIONGATEOS GOVERNANCE ARTIFACTS  
CHANGE POLICY: ADDITIVE-ONLY (NO RENAMES, NO DELETES, NO SEMANTIC BREAKS)

---

## 1. Authority and Purpose (LOCKED)

This document is the **single authoritative index** of all governance artifacts within LionGateOS.
It enumerates each artifact, its scope, dependencies, and status to ensure traceability, discoverability, and audit readiness.

This index is referential only. It introduces **no runtime behavior** and **no new requirements**.

---

## 2. Indexing Principles (LOCKED)

1. **Completeness:** All governance artifacts must be listed here.
2. **Accuracy:** Entries must reflect the current authoritative state.
3. **Additive-Only:** New entries may be appended only.
4. **Non-Interpretive:** This index does not restate or reinterpret rules.
5. **Traceability:** Dependencies between artifacts must be explicit.

---

## 3. Canonical Governance Artifacts

### 3.1 Master Governance

| Artifact | Type | Scope | Status |
|---|---|---|---|
| LionGateOS MasterChat Activation Block | CANONICAL | Global | LOCKED |

---

### 3.2 Core Security & Audit Contracts

| Artifact | Type | Scope | Depends On | Status |
|---|---|---|---|---|
| SECURITY_AUDIT_AND_TELEMETRY.md | CONTRACT | Security / Audit | — | LOCKED |
| AUDIT_EMITTER_CONTRACT.md | CONTRACT | Audit Emission | SECURITY_EVENTS_SCHEMA.md | LOCKED |
| SECURITY_EVENTS_SCHEMA.md | CONTRACT | Security Events | — | LOCKED |
| THREAT_CLASSIFICATION_MODEL.md | CONTRACT | Threat Modeling | SECURITY_EVENTS_SCHEMA.md | LOCKED |
| INCIDENT_LIFECYCLE_CONTRACT.md | CONTRACT | Incident Management | SECURITY_EVENTS_SCHEMA.md, THREAT_CLASSIFICATION_MODEL.md | LOCKED |
| POST_INCIDENT_REVIEW_CONTRACT.md | CONTRACT | Governance Review | INCIDENT_LIFECYCLE_CONTRACT.md | LOCKED |
| SECURITY_POLICY_OVERRIDE_CONTRACT.md | CONTRACT | Security Exceptions | Multiple | LOCKED |
| CROSS_APP_TRUST_BOUNDARY_CONTRACT.md | CONTRACT | Cross-Boundary Trust | Multiple | LOCKED |

---

### 3.3 Governance Process & Meta-Contracts

| Artifact | Type | Scope | Depends On | Status |
|---|---|---|---|---|
| GOVERNANCE_CHANGE_CONTROL_CONTRACT.md | CONTRACT | Governance Evolution | — | LOCKED |
| SECURITY_COMPLIANCE_MAPPING_CONTRACT.md | CONTRACT | External Compliance Mapping | Multiple | LOCKED |

---

## 4. Dependency Notes (LOCKED)

- Dependencies listed indicate **conceptual consumption**, not implementation coupling.
- No artifact listed here may be modified except via additive append per governance rules.
- Removal of an artifact requires a superseding governance decision and does not delete historical entries.

---

## 5. Update Procedure (LOCKED)

To add a new governance artifact:
1. Create the artifact under additive-only rules
2. Append a new row in the appropriate section of this index
3. Commit both changes together with a descriptive message

---

## 6. Non-Goals (LOCKED)

This index does NOT:
- Replace reading the underlying documents
- Enforce governance rules
- Summarize or interpret contract content

---

## 7. Status

This document is:
- Governance-only
- Non-visual
- Non-runtime
- Additive-only
- Authoritative index

END OF DOCUMENT
