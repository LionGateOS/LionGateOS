import { analyzeJobEstimate } from '../../services/geminiService';
import {
  IntelligenceContext,
  IntelligencePersona,
  IntelligenceResponseMeta,
  IntelligenceTask,
} from './types';
import { normalizeContext } from './ContextNormalizer';

export interface EstimateRequestOptions {
  description: string;
  imageBase64?: string;
  location: { country: string; currency: string; state?: string };
  tradeContext?: string;
  context?: Partial<IntelligenceContext>;
  persona?: Partial<IntelligencePersona>;
}

export interface EstimateResultWithMeta {
  meta: IntelligenceResponseMeta;
  result: any | null;
}

export class ModularIntelligenceEngine {
  private basePersona: IntelligencePersona;

  constructor(basePersona: IntelligencePersona) {
    this.basePersona = basePersona;
  }

  getPersona(): IntelligencePersona {
    return this.basePersona;
  }

  async generateEstimate(
    task: IntelligenceTask,
    options: EstimateRequestOptions
  ): Promise<EstimateResultWithMeta> {
    const normalizedContext = normalizeContext(options.context);

    const started = performance.now?.() ?? Date.now();
    let safetyFallbackUsed = false;

    let result = null;
    try {
      result = await analyzeJobEstimate(
        this.buildAugmentedDescription(
          options.description,
          normalizedContext,
          this.basePersona
        ),
        options.imageBase64,
        options.location,
        options.tradeContext
      );
    } catch (_err) {
      safetyFallbackUsed = true;
      result = null;
    }

    const ended = performance.now?.() ?? Date.now();

    const meta: IntelligenceResponseMeta = {
      taskId: task.id,
      personaId: this.basePersona.id,
      latencyMs: Math.max(0, ended - started),
      model: 'gemini-structured-estimate',
      safetyFallbackUsed,
    };

    return { meta, result };
  }

  private buildAugmentedDescription(
    description: string,
    context: IntelligenceContext,
    persona: IntelligencePersona
  ): string {
    const contextParts: string[] = [];

    if (context.industry) {
      contextParts.push(`Industry: ${context.industry}`);
    }
    if (context.trade) {
      contextParts.push(`Trade: ${context.trade}`);
    }
    if (context.projectType) {
      contextParts.push(`Project type: ${context.projectType}`);
    }
    if (context.locale) {
      const loc = context.locale;
      contextParts.push(
        `Location: ${loc.country}${
          loc.stateOrProvince ? ` - ${loc.stateOrProvince}` : ''
        } (${loc.currency})`
      );
    }
    if (context.clientName) {
      contextParts.push(`Client name: ${context.clientName}`);
    }

    const contextBlock =
      contextParts.length > 0
        ? `\n\nContext for this estimate:\n- ${contextParts.join(
            '\n- '
          )}`
        : '';

    const personaBlock = `\n\nPersona & tone:\n- Act as: ${persona.name}\n- Style: ${persona.description}\n- Tone: ${persona.tone}`;

    return `${description.trim()}${contextBlock}${personaBlock}`;
  }
}
