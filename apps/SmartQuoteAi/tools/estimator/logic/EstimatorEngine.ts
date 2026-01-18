import type { EstimatorPreset } from "../data/models";

export type EstimateCostType =
  | "material"
  | "labor"
  | "equipment"
  | "subcontract"
  | "other";

export interface EstimateLineItem {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  unitCost: number;
  /**
   * High level cost bucket. Used for reporting and breakdowns.
   * Optional for now so existing drafts remain valid.
   */
  costType?: EstimateCostType;
  /**
   * Optional line-level overrides. If omitted, draft-level defaults are used.
   */
  wastePercent?: number;
  overheadPercent?: number;
  marginPercent?: number;
  taxRatePercent?: number;
}

export interface EstimateDraft {
  id: string;
  presetSource?: EstimatorPreset["id"];
  items: EstimateLineItem[];
  /**
   * Job-level defaults for overhead, margin, tax and waste.
   * Line items can override these case-by-case.
   */
  wastePercent?: number;
  overheadPercent?: number;
  marginPercent?: number;
  taxRatePercent?: number;
}

export interface EstimateTotals {
  /**
   * Sum of quantity * unitCost before any add-ons.
   */
  baseCost: number;
  wasteCost: number;
  overheadCost: number;
  marginAmount: number;
  taxAmount: number;
  grandTotal: number;
  /**
   * Simple roll-up by costType (material, labor, etc).
   */
  byType: Record<string, number>;
}

/**
 * Deterministic evaluation output.
 * This intentionally avoids prose or AI-style language.
 */
export type EstimateAssessment = "underpriced" | "reasonable" | "risky";

export interface EstimateEvaluation {
  assessment: EstimateAssessment;
  /**
   * Percentage margin actually achieved vs base cost.
   */
  effectiveMarginPercent: number;
  /**
   * Deterministic explanation values for UI display.
   */
  signals: {
    marginBelowTarget: boolean;
    marginAboveTarget: boolean;
    unusuallyHighOverhead: boolean;
  };
}

function safePercent(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return value;
}

function safeString(value: unknown, fallback: string = ""): string {
  if (typeof value !== "string") return fallback;
  return value;
}

function clampPositiveNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value <= 0) return null;
  return value;
}

function normalizeLineItemInput(
  item: Omit<EstimateLineItem, "id">
): Omit<EstimateLineItem, "id"> | null {
  const label = safeString(item.label, "").trim();
  const unit = safeString(item.unit, "").trim();
  const quantity = clampPositiveNumber(item.quantity);
  const unitCost = clampPositiveNumber(item.unitCost);

  if (!label) return null;
  if (quantity === null) return null;
  if (unitCost === null) return null;

  return {
    ...item,
    label,
    unit: unit || "unit",
    quantity,
    unitCost,
  };
}

/**
 * Build a brand new draft, optionally linked to a preset.
 * For now we seed reasonable defaults for overhead / margin / tax / waste.
 */
export function buildEmptyDraft(
  presetId?: EstimatorPreset["id"]
): EstimateDraft {
  return {
    id: `draft-${Date.now()}`,
    presetSource: presetId,
    items: [],
    wastePercent: 5,
    overheadPercent: 10,
    marginPercent: 15,
    taxRatePercent: 13
  };
}

/**
 * Add a line item to the draft, automatically assigning an ID and
 * applying safe defaults for any missing advanced fields.
 */
export function addLineItem(
  draft: EstimateDraft,
  item: Omit<EstimateLineItem, "id">
): EstimateDraft {
  const normalized = normalizeLineItemInput(item);
  if (!normalized) return draft;

  const costType: EstimateCostType = normalized.costType ?? "other";

  const newItem: EstimateLineItem = {
    id: `item-${draft.items.length + 1}`,
    label: normalized.label,
    quantity: normalized.quantity,
    unit: normalized.unit,
    unitCost: normalized.unitCost,
    costType,
    wastePercent: normalized.wastePercent,
    overheadPercent: normalized.overheadPercent,
    marginPercent: normalized.marginPercent,
    taxRatePercent: normalized.taxRatePercent
  };

  return {
    ...draft,
    items: [...draft.items, newItem]
  };
}

/**
 * Core calculation engine.
 * Keeps all financial math deterministic and traceable.
 */
export function calculateTotals(draft: EstimateDraft): EstimateTotals {
  let baseCost = 0;
  let wasteCost = 0;
  let overheadCost = 0;
  let marginAmount = 0;
  let taxAmount = 0;
  const byType: Record<string, number> = {};

  const defaultWaste = safePercent(draft.wastePercent, 0);
  const defaultOverhead = safePercent(draft.overheadPercent, 0);
  const defaultMargin = safePercent(draft.marginPercent, 0);
  const defaultTax = safePercent(draft.taxRatePercent, 0);

  for (const item of draft.items) {
    const qty = typeof item.quantity === "number" && Number.isFinite(item.quantity) ? item.quantity : 0;
    const uc = typeof item.unitCost === "number" && Number.isFinite(item.unitCost) ? item.unitCost : 0;
    const lineBase = qty > 0 && uc > 0 ? qty * uc : 0;
    if (lineBase <= 0) continue;

    baseCost += lineBase;

    const wastePct = safePercent(item.wastePercent, defaultWaste);
    const overheadPct = safePercent(item.overheadPercent, defaultOverhead);
    const marginPct = safePercent(item.marginPercent, defaultMargin);
    const taxPct = safePercent(item.taxRatePercent, defaultTax);

    const lineWaste = (lineBase * wastePct) / 100;
    const basePlusWaste = lineBase + lineWaste;

    const lineOverhead = (basePlusWaste * overheadPct) / 100;
    const basePlusWasteOverhead = basePlusWaste + lineOverhead;

    const lineMargin = (basePlusWasteOverhead * marginPct) / 100;
    const basePlusAll = basePlusWasteOverhead + lineMargin;

    const lineTax = (basePlusAll * taxPct) / 100;

    wasteCost += lineWaste;
    overheadCost += lineOverhead;
    marginAmount += lineMargin;
    taxAmount += lineTax;

    const bucket = item.costType ?? "other";
    byType[bucket] = (byType[bucket] ?? 0) + lineBase;
  }

  const grandTotal =
    baseCost + wasteCost + overheadCost + marginAmount + taxAmount;

  return {
    baseCost,
    wasteCost,
    overheadCost,
    marginAmount,
    taxAmount,
    grandTotal,
    byType
  };
}

/**
 * Deterministic estimate evaluation.
 * This provides the "underpriced / reasonable / risky" signal
 * without any AI or heuristics that cannot be explained.
 */
export function evaluateEstimate(
  totals: EstimateTotals,
  targetMarginPercent: number = 15
): EstimateEvaluation {
  if (totals.baseCost <= 0) {
    return {
      assessment: "underpriced",
      effectiveMarginPercent: 0,
      signals: {
        marginBelowTarget: true,
        marginAboveTarget: false,
        unusuallyHighOverhead: false
      }
    };
  }

  const effectiveMarginPercent =
    (totals.marginAmount / totals.baseCost) * 100;

  const marginBelowTarget =
    effectiveMarginPercent < targetMarginPercent * 0.75;

  const marginAboveTarget =
    effectiveMarginPercent > targetMarginPercent * 1.5;

  const unusuallyHighOverhead =
    totals.overheadCost / totals.baseCost > 0.35;

  let assessment: EstimateAssessment = "reasonable";

  if (marginBelowTarget) {
    assessment = "underpriced";
  } else if (marginAboveTarget || unusuallyHighOverhead) {
    assessment = "risky";
  }

  return {
    assessment,
    effectiveMarginPercent,
    signals: {
      marginBelowTarget,
      marginAboveTarget,
      unusuallyHighOverhead
    }
  };
}
