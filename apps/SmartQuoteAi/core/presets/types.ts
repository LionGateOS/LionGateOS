export type PresetCategory = 'trade' | 'scope' | 'bundle';

export interface TradePreset {
  id: string;
  label: string;
  industryKey: string;
  tradeName: string;
  defaultDetailLevel?: 'simple' | 'detailed';
}

export interface ScopePreset {
  id: string;
  label: string;
  descriptionTemplate: string;
  recommendedTrade?: string;
  typicalDurationHours?: number;
}

export interface BundlePreset {
  id: string;
  label: string;
  descriptionTemplate: string;
  suggestedLineItems: string[];
  scopePresetIds?: string[];
  tradePresetIds?: string[];
}

export interface PresetLibrary {
  trades: TradePreset[];
  scopes: ScopePreset[];
  bundles: BundlePreset[];
}
