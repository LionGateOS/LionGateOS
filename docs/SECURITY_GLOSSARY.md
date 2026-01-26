# SECURITY_GLOSSARY.md

STATUS: GOVERNANCE-ONLY · NON-VISUAL · NON-RUNTIME  
APPLIES TO: ALL GOVERNANCE ARTIFACTS  
CHANGE POLICY: ADDITIVE-ONLY (NO RENAMES, NO DELETES, NO SEMANTIC BREAKS)

---

## 1. Authority and Purpose (LOCKED)

This document defines the **canonical glossary** for security and governance terminology used across LionGateOS.
Its purpose is to eliminate ambiguity, ensure consistent interpretation, and prevent semantic drift between governance artifacts.

This glossary is authoritative. Where conflicts arise, definitions in this document prevail unless explicitly superseded additively.

---

## 2. Glossary Principles (LOCKED)

1. **Single Meaning:** Each term has one canonical meaning.
2. **Additive Evolution:** New terms may be appended only.
3. **Non-Circular:** Definitions must not rely on undefined terms.
4. **Governance-First:** Terms are defined in governance context, not implementation detail.
5. **Stability:** Definitions must not change semantics retroactively.

---

## 3. Canonical Terms

### Actor
An entity that initiates or causes an action. Actors may be human users, services, systems, AI agents, or integrations.

### Audit Event
A security-relevant record emitted for traceability, review, and compliance, conforming to SECURITY_EVENTS_SCHEMA.md.

### Boundary
A point at which data, control, or authority crosses between distinct trust domains (apps, modules, tenants, systems, or external entities).

### Confidence
A measure of signal reliability indicating likelihood of correctness, independent of impact.

### Event
An immutable record of a security-relevant occurrence within LionGateOS.

### Governance Artifact
A non-runtime, authoritative document defining rules, contracts, schemas, or processes governing LionGateOS behavior.

### Incident
A governed aggregation of one or more security events representing elevated risk requiring review or response.

### Integrity
Assurance that data has not been altered, tampered with, or corrupted.

### Override
A time-bound, explicitly authorized exception to a security control.

### Policy
A formal rule defining allowed or denied behavior under specified conditions.

### Severity
A measure of potential impact or harm associated with a security event.

### Threat Class
A categorical description of the type of risk represented by an event or incident.

### Threat Level
An ordinal representation of overall risk posture, independent of certainty.

### Trust Level
A measure of confidence in the safety of an interaction across a boundary.

---

## 4. Status

This glossary is:
- Governance-only
- Non-visual
- Non-runtime
- Additive-only
- Canonical for terminology

END OF DOCUMENT
