import type { EstimatorPreset, EstimateRequest, EstimateResponse } from "../types/estimator";

const presets: EstimatorPreset[] = [
  {
    id: "smart-estimator-basic",
    name: "Smart Estimator – Basic Setup",
    category: "SmartQuoteAI Pro",
    description: "Baseline setup of Smart Estimator with default workflows.",
    baseHours: 10,
    complexity: "low",
  },
  {
    id: "smart-estimator-advanced",
    name: "Smart Estimator – Advanced Configuration",
    category: "SmartQuoteAI Pro",
    description: "Advanced presets, workflows, and AI suggestions tuned.",
    baseHours: 25,
    complexity: "medium",
  },
  {
    id: "smart-estimator-full-suite",
    name: "Smart Estimator – Full Suite",
    category: "SmartQuoteAI Pro",
    description: "Enterprise-grade rollout with custom workflows and governance.",
    baseHours: 60,
    complexity: "high",
  },
];

export function listEstimatorPresets(): EstimatorPreset[] {
  return presets;
}

export function calculateEstimate(req: EstimateRequest): EstimateResponse {
  const basePreset = req.presetId
    ? presets.find((p) => p.id === req.presetId) ?? null
    : null;

  const baseHours = req.baseHours || basePreset?.baseHours || 0;

  const complexityMultiplier =
    req.complexity === "high" ? 1.5 :
    req.complexity === "medium" ? 1.2 :
    1;

  const adjustedHours = baseHours * complexityMultiplier;
  const bufferMultiplier = 1 + req.riskBufferPercent / 100;
  const totalWithBuffer = adjustedHours * req.hourlyRate * bufferMultiplier;

  const label =
    req.customLabel ||
    basePreset?.name ||
    "Custom SmartQuoteAI Pro Estimate";

  return {
    label,
    hours: Math.round(adjustedHours * 10) / 10,
    hourlyRate: req.hourlyRate,
    riskBufferPercent: req.riskBufferPercent,
    totalWithBuffer: Math.round(totalWithBuffer),
    currency: "USD",
  };
}
