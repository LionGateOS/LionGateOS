# LionGateOS Travels — MVP Boundaries (Canonical)

**Status:** CANONICAL  
**Applies To:** LionGateOS Travels module, all future work, all AIs/devs.

---

## 1) Purpose

Define the **minimum viable product** for LionGateOS Travels in a way that:
- prevents scope creep,
- preserves modular boundaries,
- remains Core-mediated and logic-only.

---

## 2) MVP IN SCOPE (Allowed)

### 2.1 Artifacts Produced (Logic Outputs)
- Destination guide content (structured Markdown/JSON)
- Itinerary proposal (non-temporal node sequence)
- Risk assessment flags + mitigation guidance
- Affiliate/partner link **proposals** (raw URLs + rationale)

### 2.2 Core-Provided Inputs (Required)
- User intent profile (preferences, constraints)
- Destination parameters (region, season, duration)
- External data packets fetched by Core (weather/advisories snapshots)
- Optional partner inventory lists (affiliate offerings)

### 2.3 Persistence (Allowed in Travels)
- Guide templates
- Itinerary templates
- Risk heuristics (logic rules)
- Curated knowledge base (non-user PII)

---

## 3) MVP OUT OF SCOPE (Forbidden)

Travels MUST NOT:
- perform direct bookings (flights/hotels/activities)
- call external APIs (Core fetches; Travels processes)
- handle payments, currency conversion, or checkout
- execute affiliate tracking/cookies/click attribution
- send emails, messages, or notifications
- store user identity, PII, payment data, or global booking history
- schedule events directly (Calendar does time-slotting via Core)
- communicate with other modules directly (must route via Core)

---

## 4) Canonical Event Interface (High Level)

Travels emits ONLY to Core:
- PLAN_PROPOSAL_GENERATED
- GUIDE_CONTENT_READY
- RISK_ALERT_EMITTED
- AFFILIATE_LINK_PROPOSAL

Travels receives ONLY from Core:
- TRAVELS_REQUESTED (intent + params)
- EXTERNAL_DATA_PACKET (snapshots)
- PARTNER_INVENTORY_PACKET (optional)
- USER_PREFERENCE_CONTEXT (non-PII)

---

## 5) MVP Success Criteria

The MVP is complete when:
1. A single destination request yields:
   - one guide artifact,
   - one plan proposal,
   - optional risk flags,
   - optional affiliate proposals.
2. No forbidden behaviors occur (Section 3).
3. All outputs are Core-mediated and auditable.

---

## 6) Freeze Rule

This document freezes the MVP scope.

Any proposed expansion MUST:
- be written as a new governance amendment file,
- be reviewed under LionGateOS Core,
- explicitly declare whether it is CANONICAL or SUPPORTING.

---
