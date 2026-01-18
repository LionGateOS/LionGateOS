import type { Request, Response } from "express";
import { buildProposal } from "../services/proposalService";
import type { ProposalRequestPayload } from "../types/proposal";

export function generateProposalHandler(req: Request, res: Response) {
  const body = req.body as Partial<ProposalRequestPayload>;

  if (!body.clientName || !body.projectName || !body.summary || !body.estimate) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields: clientName, projectName, summary, and estimate",
    });
  }

  try {
    const proposal = buildProposal(body as ProposalRequestPayload);
    res.json({ ok: true, data: proposal });
  } catch (err) {
    console.error("[proposal] error building proposal", err);
    res.status(500).json({ ok: false, error: "Failed to build proposal document" });
  }
}
