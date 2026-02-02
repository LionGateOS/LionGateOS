# LionGateOS Travels ↔ LionGateOS Core — Event Contract (Canonical)

**Status:** CANONICAL  
**Rule:** All communications are **Source → Core → Destination**.  
**Travels is logic-only. Core owns I/O, identity, persistence, audit, messaging, monetization execution.**

---

## 1) Governance Pre-Routing (Core-Owned)

Before routing any Travels-related event, Core MUST apply:
- system lock controls
- policy constraints (if any)
- audit stamping (correlation_id, timestamp, requester_context)

Travels never enforces governance directly; it only receives an allow/deny outcome via Core context.

---

## 2) Inbound to Travels (Core → Travels)

| Event Name | Source | Core Validation | Destination | Payload (minimum) |
|---|---|---|---|---|
| TRAVELS_REQUESTED | User/UI | Validate requester + request format | Travels | request_id, destination_hint, duration_hint, intent_profile |
| EXTERNAL_DATA_PACKET | Core Fetch Layer | Validate source freshness + integrity | Travels | packet_type (weather/advisory), snapshot, captured_at |
| PARTNER_INVENTORY_PACKET | Core Partner Layer | Validate allowed partner set | Travels | partner_id, items[], captured_at |
| USER_PREFERENCE_CONTEXT | Core SoR | Validate privacy class | Travels | preference_flags (non-PII), constraints |

---

## 3) Outbound from Travels (Travels → Core)

| Event Name | Source | Core Validation | Core Action | Destination (via Core) |
|---|---|---|---|---|
| GUIDE_CONTENT_READY | Travels | Schema validate + classify content | Persist + render-ready | User/UI (Core-rendered) |
| PLAN_PROPOSAL_GENERATED | Travels | Schema validate nodes | Store plan proposal | Calendar (slot request) **via Core only** |
| RISK_ALERT_EMITTED | Travels | Severity validate + dedupe | Notify + store | User notification (Core messaging) |
| AFFILIATE_LINK_PROPOSAL | Travels | Validate URL policy + partner allowlist | Render link cards | Budget attribution + partner tracking (Core-owned) |

---

## 4) Forbidden Communications

Travels MUST NOT directly communicate with:
- Calendar
- Budget
- SmartQuoteAI
- ROWS
- external APIs
- affiliate networks

All such actions occur only as **Core-mediated consequences** of Events.

---

## 5) Minimum Schemas (Contracts)

### 5.1 PLAN_PROPOSAL_GENERATED
- request_id
- nodes[]: { node_type, title, description, constraints[] }
- risk_flags[]
- confidence (0–1)

### 5.2 GUIDE_CONTENT_READY
- request_id
- guide_markdown
- metadata: { environment_type, seasonality, mobility, offline_required }

### 5.3 AFFILIATE_LINK_PROPOSAL
- request_id
- proposals[]: { label, url, rationale, category }
- disclosure_required: true

---

## 6) Routing Alignment Statement

This contract is consistent with:
- Master Routing Table doctrine (Core as sole router)
- Module isolation (no direct module-to-module communication)
- Logic-only module design (Travels produces proposals, Core executes)

---
