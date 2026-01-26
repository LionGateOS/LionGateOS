# Travels → Budget Reflection Mapping (v1)

## Purpose
This document defines how **LionGateOS Travels** emits events that are *reflected* inside **Budget** under the Planner v1 Reflection Doctrine.

Budget remains passive. It mirrors reality; it does not guide, predict, or decide.

---

## Core Rule
Travels **emits events**.  
Budget **records financial reality** resulting from those events.

No assumptions. No recommendations.

---

## Travels Events → Budget Reflections

### TRIP_CREATED
- Budget records: **No financial entry**
- Visibility: Timeline only
- Reversible: Yes (event removal)
- Notes: Structural event only

### TRIP_BUDGET_DEFINED (if user enters a number)
- Budget records: **Declared context only**
- Visibility: Scenario / annotation view
- Reversible: Yes
- Notes: Not enforced, not optimized

### EXPENSE_LOGGED (Travel)
- Budget records: **Expense**
- Visibility: Timeline, category totals
- Reversible: Yes (expense removed)
- Source: Receipt or manual log

### RESERVATION_CONFIRMED
- Budget records: **Expected expense**
- Visibility: Scenario view
- Reversible: Yes (cancellation)
- Notes: Clearly marked as “not yet realized”

### RESERVATION_PAID
- Budget records: **Realized expense**
- Visibility: All views
- Reversible: Yes (refund event)

### REFUND_ISSUED
- Budget records: **Negative expense**
- Visibility: Timeline + category
- Reversible: No (new event only)

---

## Explicit Exclusions
Budget will never:
- Suggest alternative bookings
- Compare vendors
- Optimize travel spend
- Predict total trip cost

---

## Status
Locked under Planner v1