# SmartQuoteAI — Canonical Estimation & Classification Contract
VERSION: 1.0 (Frozen)
STATUS: Authoritative
SCOPE: SmartQuoteAI Module Only

---

## 1. Purpose

This document defines the **single authoritative contract** governing how SmartQuoteAI:
- Performs estimates (quotes)
- Classifies receipts
- Uses Gemini as an advisory intelligence layer
- Interacts with LionGateOS Core, Budget, and future modules

This contract is **additive-only**. Revisions require explicit governance approval.

---

## 2. Design Principles (Hard Rules)

- SmartQuoteAI is **stateless**
- SmartQuoteAI is **logic-only**
- SmartQuoteAI is **advisory**, never authoritative
- LionGateOS Core is the **system of record**
- Budget is **deterministic and non-interpreting**
- All AI output must be **explainable, reviewable, and overridable**
- No silent assumptions
- No hidden persistence

---

## 3. Gemini’s Role (Strictly Bounded)

Gemini MAY:
- Extract scope from images and text
- Propose average prices and ranges
- Identify tools, materials, and labor categories
- Declare assumptions explicitly
- Identify risks and ambiguities
- Assign confidence scores

Gemini MAY NOT:
- Assert factual pricing guarantees
- Modify financial records
- Store receipts or quotes
- Write directly to Budget
- Override user confirmation
- Invent compliance requirements

Gemini output is **always advisory**.

---

## 4. Estimator Schema (Quotes)

### Quote Artifact

- quote_id: UUID
- raw_image_ref: URI or String
- scope_items: Array of
  - item_name
  - quantity
  - description
- assumptions: Array[String]
- risk_factors: Array[String]
- estimated_cost: Decimal
- confidence_score: Float (0.0–1.0)

### Rules

- All assumptions must be listed
- All risks must be explicit
- Confidence score must reflect extraction uncertainty
- Quote is invalid until confirmed by Core

---

## 5. Receipt Classification Schema

### Receipt Artifact

- receipt_id: UUID
- vendor_name: String
- timestamp: DateTime
- line_items: Array of
  - item_name
  - quantity
  - unit_price
  - line_total
- classification: Enum
  - TOOL_OR_EQUIPMENT
  - MATERIAL_OR_SUPPLY
  - CONSUMABLE
  - PERSONAL_OR_NON_JOB
  - UNKNOWN
- financial_summary:
  - subtotal
  - tax
  - total
- associated_quote_id: UUID (Optional)

### Rules

- All classifications are advisory
- User must confirm before emission
- Line items must be individually toggleable
- No automatic budget mutation

---

## 6. Core Interaction

SmartQuoteAI emits events only:

- QUOTE_PROPOSED
- QUOTE_CONFIDENCE_LOW
- CLARIFICATION_REQUIRED
- EXPENSE_RECEIPT_PROPOSED
- EXPENSE_RECEIPT_CONFIRMED

LionGateOS Core:
- Validates
- Persists
- Routes
- Audits

---

## 7. Prohibitions (Non-Negotiable)

SmartQuoteAI must NOT:
- Store historical quotes or receipts
- Learn from Budget outcomes
- Modify Budget data
- Infer tax or legal compliance
- Present estimates as guarantees
- Operate without confidence disclosure

---

## 8. Forward Compatibility

This contract supports future:
- AR-based extraction
- Supplier catalogs
- Premium pricing feeds
- Regional compliance modules

Without requiring schema changes.

---

## 9. Freeze Declaration

This document is **frozen** as the canonical SmartQuoteAI contract.
All future work must comply with it.

---
