import { ModularIntelligenceEngine } from './ModularIntelligenceEngine';
import { createDefaultPersona } from './PersonalityBlendEngine';
import type {
  IntelligenceContext,
  IntelligencePersona,
  IntelligenceTask,
  IntelligenceResponseMeta,
} from './types';

let sharedEngine: ModularIntelligenceEngine | null = null;

export const getSharedIntelligenceEngine = (): ModularIntelligenceEngine => {
  if (!sharedEngine) {
    sharedEngine = new ModularIntelligenceEngine(createDefaultPersona());
  }
  return sharedEngine;
};

export type {
  IntelligenceContext,
  IntelligencePersona,
  IntelligenceTask,
  IntelligenceResponseMeta,
};

export { ModularIntelligenceEngine };
