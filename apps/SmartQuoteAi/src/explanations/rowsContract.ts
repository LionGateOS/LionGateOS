// rowsContract.ts
// Phase 3 — ROWS → SmartQuoteAI Explanation Contract
// CANONICAL · DESIGN-LOCK IMPLEMENTATION
// This file is additive-only and enforces ROWS semantic guarantees.

export type RowsDomain = 'risk' | 'scope' | 'responsibility' | 'dependency' | 'exclusion';

export interface RowsField {
  domain: RowsDomain;
  id: string;
  text: string;
  order: number;
}

export interface RowsContract {
  fields: RowsField[];
}

export function validateRowsContract(contract: RowsContract): boolean {
  if (!contract || !Array.isArray(contract.fields)) return false;

  const requiredDomains: RowsDomain[] = [
    'risk',
    'scope',
    'responsibility',
    'dependency',
    'exclusion',
  ];

  const presentDomains = new Set(contract.fields.map(f => f.domain));

  for (const domain of requiredDomains) {
    if (!presentDomains.has(domain)) return false;
  }

  return true;
}
