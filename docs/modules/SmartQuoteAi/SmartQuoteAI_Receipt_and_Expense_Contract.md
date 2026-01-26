# SmartQuoteAI Receipt & Expense Contract (Canonical)

## Purpose
This document defines how SmartQuoteAI processes scanned receipts, classifies line items,
and emits expense events to LionGateOS Core for reconciliation by Budget.

This contract is CANONICAL and binding.

---

## Scope
Applies to:
- SmartQuoteAI
- LionGateOS Core
- Budget (downstream only)

Does NOT apply to:
- UI rendering
- Payment processing
- Vendor integrations

---

## Receipt Intake

### Input Source
- Receipt image captured via Core-owned UI
- Image forwarded to SmartQuoteAI

### Supported Formats
- Photo (JPG, PNG)
- Scanned document

---

## Line Item Extraction

SmartQuoteAI uses AI/OCR to extract:

- Item name
- Quantity
- Unit price
- Line total
- Tax (if present)
- Vendor (if identifiable)

---

## Item Classification

Each extracted line item MUST be classified into one of:

- TOOL_OR_EQUIPMENT
- MATERIAL_OR_SUPPLY
- CONSUMABLE
- PERSONAL_OR_NON_JOB
- UNKNOWN

Classification is advisory and user-correctable.

---

## User Confirmation

Before emission:
- User may deselect any line item
- Deselected items are discarded
- Confirmed items proceed to event emission

---

## Expense Event Emission

### Event Name
EXPENSE_RECEIPT_CONFIRMED

### Emitted To
LionGateOS Core ONLY

### Payload
- source_module: SmartQuoteAI
- receipt_id
- vendor
- timestamp
- confirmed_items[]
  - item_name
  - category
  - quantity
  - unit_price
  - line_total
- subtotal
- tax
- total
- associated_quote_id (optional)

---

## Core Responsibilities

Upon receiving EXPENSE_RECEIPT_CONFIRMED:
- Validate governance rules
- Persist receipt artifact
- Forward normalized expense data to Budget

---

## Budget Responsibilities

Budget MUST:
- Record expenses as realized costs
- Compare against expected costs if present
- Never reinterpret classification or intent

---

## Explicit Prohibitions

SmartQuoteAI MUST NOT:
- Store financial records long-term
- Modify Budget data
- Execute payments
- Claim real-time pricing accuracy

Budget MUST NOT:
- Classify items
- Interpret business intent
- Adjust expenses based on industry

---

## Version
v1.0 — Initial Canonical Definition
