import { IntelligenceContext } from './types';

export function normalizeContext(
  context: Partial<IntelligenceContext> | undefined
): IntelligenceContext {
  const safe = context ?? {};

  return {
    industry: safe.industry ?? undefined,
    trade: safe.trade ?? undefined,
    locale: safe.locale
      ? {
          country: safe.locale.country,
          currency: safe.locale.currency,
          stateOrProvince: safe.locale.stateOrProvince,
        }
      : undefined,
    clientName: safe.clientName?.trim() || undefined,
    projectType: safe.projectType ?? undefined,
  };
}
