import { BundlePreset, PresetLibrary, ScopePreset, TradePreset } from './types';
import { STARTER_PRESET_LIBRARY } from './starterLibrary';

export type WorkflowSuggestionType =
  | 'add_scope'
  | 'add_bundle'
  | 'add_trade'
  | 'missing_disposal'
  | 'missing_mobilization';

export interface WorkflowSuggestion {
  id: string;
  type: WorkflowSuggestionType;
  label: string;
  details?: string;
  relatedScopeId?: string;
  relatedBundleId?: string;
}

export class WorkflowEngine {
  private library: PresetLibrary;

  constructor(library: PresetLibrary = STARTER_PRESET_LIBRARY) {
    this.library = library;
  }

  getLibrary(): PresetLibrary {
    return this.library;
  }

  getTradePresets(): TradePreset[] {
    return this.library.trades;
  }

  getScopePresets(): ScopePreset[] {
    return this.library.scopes;
  }

  getBundlePresets(): BundlePreset[] {
    return this.library.bundles;
  }

  suggestForDescription(description: string): WorkflowSuggestion[] {
    const text = description.toLowerCase();
    const suggestions: WorkflowSuggestion[] = [];

    const addSuggestion = (s: WorkflowSuggestion) => suggestions.push(s);

    // High-level scope suggestions based on keywords
    if (text.includes('bathroom')) {
      const scope = this.library.scopes.find((s) =>
        s.id === 'scope-bathroom-remodel'
      );
      if (scope) {
        addSuggestion({
          id: 'suggest-scope-bathroom-remodel',
          type: 'add_scope',
          label: 'Bathroom remodel scope',
          details: scope.descriptionTemplate,
          relatedScopeId: scope.id,
        });
      }
    }

    if (text.includes('kitchen')) {
      const scope = this.library.scopes.find((s) => s.id === 'scope-kitchen-remodel');
      if (scope) {
        addSuggestion({
          id: 'suggest-scope-kitchen-remodel',
          type: 'add_scope',
          label: 'Kitchen remodel scope',
          details: scope.descriptionTemplate,
          relatedScopeId: scope.id,
        });
      }
    }

    if (text.includes('paint') || text.includes('repaint')) {
      const bundle = this.library.bundles.find(
        (b) => b.id === 'bundle-interior-paint-standard'
      );
      if (bundle) {
        addSuggestion({
          id: 'suggest-bundle-interior-paint',
          type: 'add_bundle',
          label: 'Interior repaint bundle',
          details: bundle.descriptionTemplate,
          relatedBundleId: bundle.id,
        });
      }
    }

    // Generic "missing disposal" suggestion
    if (text.includes('demo') || text.includes('demolition') || text.includes('tear out')) {
      addSuggestion({
        id: 'suggest-missing-disposal',
        type: 'missing_disposal',
        label: 'Remember debris disposal / hauling',
        details: 'Add a line item for demolition debris disposal and hauling.',
      });
    }

    // Generic mobilization suggestion for larger jobs
    if (text.includes('whole home') || text.includes('entire house') || text.includes('full remodel')) {
      addSuggestion({
        id: 'suggest-mobilization',
        type: 'missing_mobilization',
        label: 'Consider mobilization / supervision line items',
        details:
          'For larger projects, consider adding mobilization, supervision, and project management line items.',
      });
    }

    return suggestions;
  }
}
