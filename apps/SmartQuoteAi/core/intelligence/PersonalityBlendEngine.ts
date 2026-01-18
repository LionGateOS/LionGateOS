import { IntelligencePersona, ToneStyle } from './types';

const DEFAULT_TONE: ToneStyle = 'friendly';

export function createDefaultPersona(): IntelligencePersona {
  return {
    id: 'default-professional',
    name: 'Professional Estimator',
    description:
      'A practical, friendly estimator who explains numbers clearly and avoids jargon while staying concise.',
    tone: DEFAULT_TONE,
  };
}

export function blendPersona(
  base: IntelligencePersona,
  overrides?: Partial<IntelligencePersona>
): IntelligencePersona {
  if (!overrides) return base;
  return {
    ...base,
    ...overrides,
    tone: overrides.tone ?? base.tone,
  };
}
