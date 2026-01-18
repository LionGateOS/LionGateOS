import type { Request, Response } from "express";

export function healthHandler(_req: Request, res: Response) {
  res.json({
    ok: true,
    service: "smartquoteai_pro_backend",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
