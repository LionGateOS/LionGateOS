# SECURITY_EVENTS_SCHEMA.md

STATUS: GOVERNANCE-ONLY · NON-VISUAL · NON-RUNTIME  
SCOPE: OS CORE + ALL APPS + ALL MODULES + ALL SERVICES  
CHANGE POLICY: ADDITIVE-ONLY (NO RENAMES, NO DELETES, NO SEMANTIC BREAKS)

---

## 1. Authority and Purpose (LOCKED)

This document defines the canonical, OS-level schema for **all security-relevant events** generated within LionGateOS.

It is the single authoritative taxonomy and field contract for:
- Audit emission (all emitters)
- Security review, forensic analysis, and traceability
- Downstream aggregation, alerting, and compliance mappings
- Cross-app dependency safety and governance validation

This document is **governance-only**. It does not implement runtime behavior and must not introduce UI changes.

---

## 2. Non-Negotiable Invariants (LOCKED)

1. **Single Envelope:** All security events share one top-level envelope shape.
2. **Additive-Only Evolution:** Fields and enumerations may be added only; existing meanings must remain stable.
3. **Immutability:** Once emitted, an event is immutable. Post-processing may enrich externally, but must never alter original emitted fields.
4. **No Silent Redaction:** Redaction must be explicit using the Redaction Contract in this schema; missing data must be represented via explicit nullability rules.
5. **Deterministic Categorization:** Each event must map to exactly one `category` from the canonical set.
6. **Correlation-First:** Every event must include correlation identifiers sufficient to link related events across boundaries.
7. **Privacy-Minimal by Default:** Sensitive data is forbidden unless explicitly allowed by field rules.

---

## 3. Event Envelope (Canonical Shape)

### 3.1 Required Fields (MUST)

| Field | Type | Rules |
|---|---|---|
| `schema_version` | string | Semantic version of this schema document (e.g., `1.0.0`). MUST be present. |
| `event_id` | string | Globally unique identifier (UUID recommended). |
| `event_name` | string | Dot-delimited, stable name (see §5). |
| `category` | string | One of the canonical categories in §4. |
| `severity` | string | One of: `INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. See §6. |
| `confidence` | string | One of: `HIGH`, `MEDIUM`, `LOW`. See §6. |
| `occurred_at` | string | ISO-8601 timestamp when event occurred (UTC recommended). |
| `emitted_at` | string | ISO-8601 timestamp when emitter produced the event. |
| `source` | object | Required source attribution (see §3.2). |
| `actor` | object | Required actor attribution (see §3.3). |
| `outcome` | object | Required outcome block (see §3.6). |
| `correlation` | object | Required correlation block (see §3.7). |
| `integrity` | object | Required integrity block (see §3.9). |

### 3.2 Source Block (MUST)

`source` identifies the producing component and environment.

| Field | Type | Rules |
|---|---|---|
| `source.app_id` | string | LionGateOS application identifier (e.g., `Rows`, `Budget`, `SmartQuoteAI`, `OSCore`). |
| `source.module_id` | string | Module or sub-system identifier within the app (e.g., `PermissionEngine`, `Registry`, `Importer`). |
| `source.component` | string | Concrete emitter component name (service, worker, UI module, etc.). |
| `source.environment` | string | One of: `DEV`, `TEST`, `STAGE`, `PROD`. |
| `source.version` | string | Component version or build identifier. |
| `source.host` | string|null | Hostname/container id if applicable; null allowed for pure client events. |

### 3.3 Actor Block (MUST)

`actor` identifies “who/what caused the action.”

| Field | Type | Rules |
|---|---|---|
| `actor.type` | string | One of: `USER`, `SERVICE`, `SYSTEM`, `AI_AGENT`, `INTEGRATION`. |
| `actor.id` | string | Stable identifier. For users: internal user id. For services: service principal id. For system: `SYSTEM`. |
| `actor.session_id` | string|null | Stable session identifier if present; else null. |
| `actor.ip` | string|null | IP address if available and permitted; else null. |
| `actor.user_agent` | string|null | User agent if available; else null. |

### 3.4 Tenant / Boundary Block (SHOULD)

If LionGateOS operates multi-tenant, include `boundary`.

| Field | Type | Rules |
|---|---|---|
| `boundary.tenant_id` | string|null | Tenant identifier if applicable. |
| `boundary.workspace_id` | string|null | Workspace/org identifier if applicable. |
| `boundary.project_id` | string|null | Project/context identifier if applicable. |

If not applicable, omit `boundary` entirely.

### 3.5 Subject / Resource Block (SHOULD)

`subject` identifies the object of the action (file, record, policy, registry key, integration, etc.).

| Field | Type | Rules |
|---|---|---|
| `subject.type` | string | Broad type (e.g., `TRANSACTION`, `FILE`, `POLICY`, `PERMISSION`, `REGISTRY_KEY`, `INTEGRATION`, `MODEL`, `PROMPT`, `EXPORT`). |
| `subject.id` | string|null | Stable id when available; else null. |
| `subject.path` | string|null | Path/locator when meaningful; else null. |
| `subject.classification` | string|null | Data classification: `PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `RESTRICTED` (or app-defined additive extension). |
| `subject.pii` | boolean | Indicates subject may contain PII. MUST be false unless known true. |

### 3.6 Outcome Block (MUST)

| Field | Type | Rules |
|---|---|---|
| `outcome.status` | string | One of: `SUCCESS`, `FAIL`, `DENY`, `ERROR`, `PARTIAL`. |
| `outcome.reason` | string|null | Stable reason code (not free-form) when possible (e.g., `POLICY_DENY`, `AUTH_FAILED`, `VALIDATION_ERROR`). |
| `outcome.message` | string|null | Human-readable message; MUST NOT include secrets or raw PII. |
| `outcome.error_id` | string|null | Stable error identifier/correlation if an exception occurred. |

### 3.7 Correlation Block (MUST)

Correlation enables end-to-end tracing and incident reconstruction.

| Field | Type | Rules |
|---|---|---|
| `correlation.trace_id` | string | Trace identifier for the request or workflow. |
| `correlation.request_id` | string|null | Request identifier (HTTP request id, job id, etc.). |
| `correlation.parent_event_id` | string|null | If causally linked to a prior event. |
| `correlation.chain_id` | string|null | Stable chain id for multi-step workflows (imports, exports, AI tool chains). |

### 3.8 Privacy / Redaction Block (SHOULD)

If any field is redacted or excluded due to policy, include `privacy`.

| Field | Type | Rules |
|---|---|---|
| `privacy.redactions` | array | List of redaction descriptors (see below). |
| `privacy.policy_basis` | string|null | Stable code for why redaction occurred (e.g., `PII_MINIMIZATION`, `SECRET_PROTECTION`). |

Redaction Descriptor:
- `field`: string (JSONPath-like pointer, e.g., `subject.path`)
- `method`: string (`OMITTED`, `MASKED`, `HASHED`, `TOKENIZED`)
- `note`: string|null (non-sensitive, short)

If no redactions occurred, omit `privacy`.

### 3.9 Integrity Block (MUST)

| Field | Type | Rules |
|---|---|---|
| `integrity.hash_alg` | string | Hash algorithm identifier (e.g., `SHA-256`). |
| `integrity.hash` | string | Hash over the canonical serialized event envelope (excluding transport metadata). |
| `integrity.signature` | string|null | Optional signature if signing is enabled. |
| `integrity.sequence` | number|null | Optional monotonic sequence number per emitter (helps detect gaps). |

---

## 4. Canonical Categories (LOCKED)

The `category` field MUST be one of the following:

1. `AUTH`
2. `PERMISSION`
3. `REGISTRY`
4. `DATA_ACCESS`
5. `CONFIG_CHANGE`
6. `AI_ACTION`
7. `INTEGRATION`
8. `SECURITY_VIOLATION`
9. `AUDIT_SYSTEM`

No other categories are permitted unless this document is updated additively.

---

## 5. Event Naming Standard (LOCKED)

### 5.1 Format
`event_name` MUST be dot-delimited:

`<category>.<domain>.<action>.<result>`

Examples (illustrative only):
- `AUTH.login.attempt`
- `PERMISSION.check.deny`
- `REGISTRY.write.success`
- `AI_ACTION.tool.invoke`
- `SECURITY_VIOLATION.anomaly.detected`

### 5.2 Naming Rules
- Lowercase recommended for readability; consistency per system is required.
- Names MUST be stable. Renaming is forbidden.
- The final segment SHOULD indicate status when meaningful (`success`, `fail`, `deny`, `error`, `detected`).
- Vendor- or app-specific extensions are allowed as additional dot segments at the end, but the prefix must remain compliant.

---

## 6. Severity and Confidence (LOCKED)

### 6.1 Severity
- `INFO`: expected, low-risk operational security events (e.g., successful login, routine permission allow)
- `LOW`: unusual but not immediately dangerous (e.g., repeated failed login within low threshold)
- `MEDIUM`: suspicious or policy-relevant (e.g., permission denies for restricted resources)
- `HIGH`: likely malicious or high-impact misconfiguration (e.g., registry tampering attempt, data export denied for restricted classification)
- `CRITICAL`: confirmed compromise indicators or policy breach requiring immediate response (e.g., exfiltration confirmed, signing key misuse detected)

### 6.2 Confidence
- `HIGH`: strong signal with low false positive probability
- `MEDIUM`: moderate signal; may require corroboration
- `LOW`: weak signal; informational for trend/correlation

Severity is impact-oriented; confidence is signal-quality-oriented. They are independent.

---

## 7. Canonical Event Families (Taxonomy)

This section defines required **families** of security events. Each family may expand additively with additional event_names.

### 7.1 AUTH
Required families:
- Authentication attempts, successes, failures
- Session creation/termination
- Credential changes and resets
- MFA enrollment/challenge outcomes (if applicable)

Recommended `subject.type` values:
- `SESSION`, `CREDENTIAL`, `MFA_FACTOR`

### 7.2 PERMISSION
Required families:
- Permission evaluation (allow/deny)
- Policy loading/versioning
- Policy enforcement overrides (if ever allowed; should be rare and high severity)

Recommended `subject.type` values:
- `PERMISSION`, `POLICY`, `RULE`

### 7.3 REGISTRY
Required families:
- Registry read/write attempts
- Registry enforcement actions (block, quarantine, remediation)
- Registry integrity checks

Recommended `subject.type` values:
- `REGISTRY_KEY`, `REGISTRY_ENTRY`

### 7.4 DATA_ACCESS
Required families:
- Read/write/export attempts for sensitive data classes
- Bulk operations (imports/exports) with classification and counts
- Unauthorized access attempts

Recommended `subject.type` values:
- `FILE`, `RECORD`, `EXPORT`, `IMPORT`

### 7.5 CONFIG_CHANGE
Required families:
- Security configuration changes
- Logging/telemetry configuration changes
- Key material configuration changes (without exposing secret values)

Recommended `subject.type` values:
- `CONFIG`, `SECRET_REFERENCE`, `KEY_REFERENCE`

### 7.6 AI_ACTION
Required families:
- AI tool invocation (what tool, what intent classification, outcome)
- Model selection/version changes (governance-relevant)
- AI-generated actions that touch permissions, registry, exports, or sensitive data

Recommended `subject.type` values:
- `MODEL`, `PROMPT`, `TOOL`, `EXPORT`, `POLICY`

### 7.7 INTEGRATION
Required families:
- Third-party connection creation/rotation/revocation
- Webhook/connector receive/send
- External auth handshake outcomes

Recommended `subject.type` values:
- `INTEGRATION`, `WEBHOOK`, `TOKEN_REFERENCE`

### 7.8 SECURITY_VIOLATION
Required families:
- Tamper detection
- Integrity failures (hash/signature mismatch)
- Suspicious behavior/anomaly detection
- Confirmed policy breach

Recommended `subject.type` values:
- `ANOMALY`, `INTEGRITY_CHECK`, `BREACH`

### 7.9 AUDIT_SYSTEM
Required families:
- Audit emitter health (queue backlog, drop counts)
- Schema validation failures
- Time sync drift warnings

Recommended `subject.type` values:
- `AUDIT_PIPELINE`, `SCHEMA`, `EMITTER`

---

## 8. Forbidden Content (LOCKED)

An event MUST NOT contain:
- Raw secrets (tokens, passwords, private keys)
- Full raw PII payloads (names, full addresses, full account numbers, etc.)
- Full document contents or transaction raw payloads
- Any data that would violate the “privacy-minimal by default” invariant

When information is needed for traceability, emit **references** (ids, hashes, tokenized handles) rather than raw content.

---

## 9. Versioning and Compatibility (LOCKED)

### 9.1 Schema Versioning
- `schema_version` is the version of this document.
- Emitters MUST set `schema_version` to the version they comply with.

### 9.2 Additive-Only Rules
Permitted:
- Adding optional fields
- Adding new event_names within existing categories
- Adding new reason codes
- Adding new subject.type values

Forbidden:
- Removing fields
- Renaming fields
- Changing the meaning of an existing field or enum value
- Replacing categories

If a new requirement is needed, it MUST be introduced as a new optional field, then later elevated to “SHOULD” or “MUST” only by an explicit governance revision.

---

## 10. Minimal Illustrative Example (Non-Authoritative)

This example is illustrative only; the authoritative content is the field rules above.

```json
{
  "schema_version": "1.0.0",
  "event_id": "3f53d4c0-8a6d-4e5c-9a9a-0c3e7f1c6f1a",
  "event_name": "permission.check.deny",
  "category": "PERMISSION",
  "severity": "MEDIUM",
  "confidence": "HIGH",
  "occurred_at": "2026-01-02T06:45:12Z",
  "emitted_at": "2026-01-02T06:45:12Z",
  "source": {
    "app_id": "OSCore",
    "module_id": "PermissionEngine",
    "component": "PermissionEvaluator",
    "environment": "PROD",
    "version": "build-20260102.1",
    "host": "oscore-svc-1"
  },
  "actor": {
    "type": "USER",
    "id": "user_123",
    "session_id": "sess_abc",
    "ip": null,
    "user_agent": null
  },
  "subject": {
    "type": "EXPORT",
    "id": "export_789",
    "path": null,
    "classification": "RESTRICTED",
    "pii": true
  },
  "outcome": {
    "status": "DENY",
    "reason": "POLICY_DENY",
    "message": "Export denied by policy.",
    "error_id": null
  },
  "correlation": {
    "trace_id": "trace_xyz",
    "request_id": "req_456",
    "parent_event_id": null,
    "chain_id": "chain_import_001"
  },
  "privacy": {
    "redactions": [
      { "field": "actor.ip", "method": "OMITTED", "note": "PII_MINIMIZATION" }
    ],
    "policy_basis": "PII_MINIMIZATION"
  },
  "integrity": {
    "hash_alg": "SHA-256",
    "hash": "deadbeef...",
    "signature": null,
    "sequence": 1042
  }
}
```

---

## 11. Compliance Checklist (Emitter Self-Validation)

An emitter is compliant if and only if:
1. All **Required Fields** in §3.1 are present.
2. `category` is one of the canonical categories in §4.
3. `severity` and `confidence` conform to §6.
4. No forbidden content in §8 is present.
5. `integrity.hash` is computed over the canonical serialized envelope (transport excluded).
6. If any field is redacted or omitted for privacy reasons, `privacy.redactions` is included and accurate.

---

## 12. Status

This contract is:
- Governance-only
- Non-visual
- Non-runtime
- Additive-only for future revisions

END OF DOCUMENT
