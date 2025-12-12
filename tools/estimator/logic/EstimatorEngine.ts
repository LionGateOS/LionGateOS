import type { EstimatorPreset } from "../data/models";

export interface EstimateLineItem {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface EstimateDraft {
  id: string;
  presetSource?: EstimatorPreset["id"];
  items: EstimateLineItem[];
}

/**
 * Build a new, empty estimate draft. In later versions this can be extended
 * to pre-seed line items based on the preset. For now it just tags the source.
 */
export function buildEmptyDraft(presetId?: EstimatorPreset["id"]): EstimateDraft {
  const safePreset = presetId ?? "custom";
  return {
    id: `draft-${safePreset}-${Date.now()}`,
    presetSource: presetId,
    items: []
  };
}

/**
 * Add a line item to the draft in an immutable way.
 */
export function addLineItem(
  draft: EstimateDraft,
  item: Omit<EstimateLineItem, "id">
): EstimateDraft {
  return {
    ...draft,
    items: [
      ...draft.items,
      {
        ...item,
        id: `item-${draft.items.length + 1}`
      }
    ]
  };
}

/**
 * Convenience helper for computing the total of a draft from its items.
 * Not yet used everywhere, but available for future extensions.
 */
export function getDraftTotal(draft: EstimateDraft): number {
  return draft.items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
  );
}
