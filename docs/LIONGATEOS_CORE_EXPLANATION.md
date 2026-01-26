# LionGateOS — Core Explanation (Canonical)

This document explains, in plain language, what LionGateOS is, why it exists,
and how its core apps work together. It is descriptive only.

---

## What LionGateOS Is

LionGateOS is a system designed to prevent silent guessing in financial,
planning, and estimation workflows.

It does not try to be perfect.
It makes uncertainty visible so humans can make better decisions.

---

## The Core Problem It Solves

Most software assumes data is clean and certain.

Real life is not:
- Receipts are messy
- Bank exports are inconsistent
- Estimates involve assumptions
- People argue when numbers cannot be explained

LionGateOS exists to make those assumptions explicit instead of hidden.

---

## Core Components (Plain English)

### ROWS
ROWS is the evidence and confidence layer.

- It looks at documents (CSV, PDF, images)
- It finds possible values
- It tags them with confidence (high / medium / low / unknown)
- It preserves where each value came from

ROWS never decides anything.
It only shows what is uncertain and why.

---

### Budget
Budget manages money with awareness of uncertainty.

- It loads CSVs normally
- It does not silently fix or guess
- It flags ambiguity instead of hiding it
- It lets humans review before trusting numbers

Budget stays honest instead of pretending everything is correct.

---

### SmartQuoteAI
SmartQuoteAI explains pricing instead of hiding assumptions.

- Quotes are broken into parts
- Each part shows how certain it is
- Estimates are clearly labeled
- Clients get explanations, not arguments

SmartQuoteAI sells defensible pricing, not fake precision.

---

## What This System Is NOT

LionGateOS is NOT:
- Fully automated decision-making
- A black box AI
- A system that overwrites user judgment
- A “set it and forget it” platform

Humans always remain responsible for final decisions.

---

## Why This Matters

When something looks wrong, the system can answer:
- Where did this number come from?
- How certain is it?
- Why was it suggested?
- What should I review?

This prevents disputes, confusion, and loss of trust.

---

## Status

This document is the canonical explanation.
If something contradicts this, the contradiction is wrong.

No execution, automation, or promises are implied.
