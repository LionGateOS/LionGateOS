// budgetMapping.ts
// Phase 3 — Budget → SmartQuoteAI Explanation Mapping
// CANONICAL · ADDITIVE-ONLY · DESIGN-LOCK IMPLEMENTATION

export interface BudgetFieldMapping {
  key: string;
  explainable: boolean;
}

export const EXPLAINABLE_BUDGET_FIELDS: BudgetFieldMapping[] = [
  { key: 'line_item_name', explainable: true },
  { key: 'quantity', explainable: true },
  { key: 'duration', explainable: true },
  { key: 'rate', explainable: true },
  { key: 'subtotal', explainable: true },
  { key: 'total', explainable: true },
  { key: 'included', explainable: true },
  { key: 'excluded', explainable: true },
];

export const SILENT_BUDGET_FIELDS: string[] = [
  'internal_formula',
  'weighting_logic',
  'heuristics',
  'contingency',
  'optimization_rules',
];

export function isBudgetFieldExplainable(key: string): boolean {
  return EXPLAINABLE_BUDGET_FIELDS.some(f => f.key === key && f.explainable);
}
