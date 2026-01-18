export type ToneStyle = 'formal' | 'friendly' | 'technical' | 'brief';

export interface IntelligencePersona {
  id: string;
  name: string;
  description: string;
  tone: ToneStyle;
}

export interface IntelligenceContext {
  industry?: string;
  trade?: string;
  locale?: {
    country: string;
    currency: string;
    stateOrProvince?: string;
  };
  clientName?: string;
  projectType?: string;
}

export interface IntelligenceTask {
  id: string;
  type: 'estimate' | 'change_order' | 'summary' | 'support';
  createdAt: string;
  source: 'smart_estimator' | 'invoice' | 'document' | 'manual';
}

export interface IntelligenceResponseMeta {
  taskId: string;
  personaId: string;
  latencyMs?: number;
  model?: string;
  safetyFallbackUsed?: boolean;
}
