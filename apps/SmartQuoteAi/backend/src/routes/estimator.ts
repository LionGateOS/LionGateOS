import type { Request, Response } from "express";
import { listEstimatorPresets, calculateEstimate } from "../services/estimatorService";
import type { EstimateRequest } from "../types/estimator";

export function getPresetsHandler(_req: Request, res: Response) {
  const data = listEstimatorPresets();
  res.json({ ok: true, data });
}

export function postEstimateHandler(req: Request, res: Response) {
  const body = req.body as Partial<EstimateRequest>;
  if (!body.hourlyRate || !body.baseHours) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields: hourlyRate and baseHours",
    });
  }

  const estimate = calculateEstimate({
    presetId: body.presetId ?? null,
    customLabel: body.customLabel,
    baseHours: body.baseHours,
    hourlyRate: body.hourlyRate,
    complexity: body.complexity ?? "medium",
    riskBufferPercent: body.riskBufferPercent ?? 20,
  });

  res.json({ ok: true, data: estimate });
}
