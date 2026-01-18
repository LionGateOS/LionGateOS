export type ComplexityLevel = "low" | "medium" | "high";

export interface EstimatorPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  baseHours: number;
  complexity: ComplexityLevel;
}

export interface EstimateRequest {
  presetId: string | null;
  customLabel?: string;
  baseHours: number;
  hourlyRate: number;
  complexity: ComplexityLevel;
  riskBufferPercent: number;
}

export interface EstimateResponse {
  label: string;
  hours: number;
  hourlyRate: number;
  riskBufferPercent: number;
  totalWithBuffer: number;
  currency: string;
}
