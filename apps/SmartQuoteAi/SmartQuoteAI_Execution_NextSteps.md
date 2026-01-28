# SmartQuoteAI — Execution Next Steps (Core-Gateway)

**Date:** 2026-01-22  
**Purpose:** Resume execution focus on SmartQuoteAI after Travels freeze.

---

## 1) Locked Constraints (Reminder)
- SmartQuoteAI is **stateless** and **logic-only**.
- No direct outreach, scraping, partner tracking, or persistence.
- All external I/O is Core-owned.
- No module-to-module communication.

---

## 2) Minimum Execution Plan (MVP)

### 2.1 Quote Pipeline (single category)
1. Core receives user input packet (photo/voice/text) and issues `QUOTE_REQUESTED` to SmartQuoteAI.
2. SmartQuoteAI returns `QUOTE_DRAFT_READY` (structured line items + confidence).
3. Core renders quote, collects acceptance.
4. On acceptance, Core emits:
   - `PROJECT_CREATED` (Core internal)
   - `BUDGET_BASELINE_CREATED` (Core → Budget)
   - `EXECUTION_PLAN_REQUESTED` (Core → ROWS)
   - `SCHEDULING_HINT_PROPOSED` (Core → Calendar) (optional)

### 2.2 SmartQuoteAI Inputs (Core-provided)
- category + subcategory
- location context
- market pricing snapshot (Core-fetched)
- governance context (constraints)

### 2.3 SmartQuoteAI Outputs (to Core only)
- itemized materials + labor + fees (as fields)
- confidence + ambiguity flags
- “data needed” signals (pricing missing)

---

## 3) First Acceptance Test (must pass)
- A quote can be generated from structured input without any SmartQuoteAI outbound I/O.
- Quote is accepted and produces the correct Core-routed events to Budget/ROWS/Calendar.

