// validationGate.ts
// Phase 3 — Validation Gate (NON-AI, SAFE)
//
// Purpose:
// Validate explanation inputs before assembly or display.
// This file performs NO pricing logic, NO AI reasoning, and NO mutations.
// It strictly validates structure and content presence.
//
// LOCKED BEHAVIOR:
// • Read-only
// • Deterministic
// • Additive-only evolution

import type { ExplanationUnit, RowsContract } from "./explanationAssembler";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateRowsContract(contract: RowsContract): ValidationResult {
  const errors: string[] = [];

  if (!contract || typeof contract !== "object") {
    return { valid: false, errors: ["RowsContract is missing or invalid"] };
  }

  if (!Array.isArray(contract.fields)) {
    return { valid: false, errors: ["RowsContract.fields must be an array"] };
  }

  if (contract.fields.length === 0) {
    errors.push("RowsContract.fields is empty");
  }

  contract.fields.forEach((field, index) => {
    if (!field) {
      errors.push(`Field at index ${index} is null or undefined`);
      return;
    }

    if (typeof field.id !== "string" || field.id.trim() === "") {
      errors.push(`Field at index ${index} has invalid id`);
    }

    if (typeof field.domain !== "string") {
      errors.push(`Field at index ${index} has invalid domain`);
    }

    if (typeof field.text !== "string" || field.text.trim() === "") {
      errors.push(`Field at index ${index} has empty text`);
    }

    if (typeof field.order !== "number") {
      errors.push(`Field at index ${index} has invalid order`);
    }
  });

  return { valid: errors.length === 0, errors };
}
