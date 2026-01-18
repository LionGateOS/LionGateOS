// explanationAssembler.ts
// Phase 3 — Explanation Assembly (NON-AI, SAFE)
//
// Purpose:
// Assemble plain-language explanation units from validated inputs.
// This file performs NO pricing logic, NO AI reasoning, and NO mutations.
// It is a pure formatter / assembler.
//
// LOCKED BEHAVIOR:
// • Read-only
// • Deterministic output
// • Additive-only evolution

export type ExplanationUnit = {
  id: string;
  domain: "scope" | "responsibility" | "risk" | "dependency" | "exclusion";
  text: string;
  order: number;
};

export type RowsContract = {
  fields: ExplanationUnit[];
};

export type AssembledExplanation = {
  units: ExplanationUnit[];
};

export function assembleExplanations(contract: RowsContract): AssembledExplanation {
  if (!contract || !Array.isArray(contract.fields)) {
    return { units: [] };
  }

  // Defensive copy + stable sort
  const units = [...contract.fields]
    .filter((u) => typeof u.text === "string" && u.text.trim().length > 0)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return { units };
}
