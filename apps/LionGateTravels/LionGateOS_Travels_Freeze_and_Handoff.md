# LionGateOS Travels — Freeze & Handoff Declaration (Canonical)

**Date:** 2026-01-22  
**Scope:** LionGateOS Travels module only  
**Purpose:** Freeze the current Travels artifact structure and define what is locked for MVP.

---

## 1) LOCKED — Travels Structural Rules

1. Travels is **logic-only**.
2. Travels has **no UI authority**.
3. Travels performs **no direct API calls**.
4. Travels emits **events/artifacts to Core only**.
5. Core owns: identity, persistence, rendering, notifications, monetization tracking, audit logs.

---

## 2) LOCKED — MVP Artifacts

Travels MVP MUST support these artifact types:

- **Guide Artifact**: environment-based guide template (Markdown/JSON)  
- **Itinerary Artifact**: node sequence (non-temporal)  
- **Risk Artifact**: alerts + mitigations (derived from Core data packets)  
- **Affiliate Proposal Artifact**: raw URL proposals only (no execution)

---

## 3) NOT IN MVP (Explicit)

- bookings / reservations
- real-time price comparisons inside Travels
- direct affiliate tracking inside Travels
- user accounts, login, payment handling inside Travels
- city-level “encyclopedia” depth (beyond 1–3 guide templates)

---

## 4) Immediate Handoff Priority

Travels structure is now frozen.

Next execution focus:
- **SmartQuoteAI** (runtime execution and integration)  
- **Core routing enforcement** (ensure module isolation)

---

## 5) Change Control

Any change to the above locked items must be documented as:
- a new governance MD file
- explicitly marked as a revision
- routed through LionGateOS Core governance

