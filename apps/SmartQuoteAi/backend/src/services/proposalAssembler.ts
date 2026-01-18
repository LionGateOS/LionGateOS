/**
 * Phase 8 – Proposal Assembly Engine
 * Combines all narrative sections (from Phase 7) into a structured document.
 */

import type { ProposalDocument, ProposalOutput } from "../types/proposal";

export function assembleProposal(doc: ProposalDocument): ProposalOutput {
  const header = `Proposal Document\nPrepared For: ${doc.meta.clientName}\nProject: ${doc.meta.projectName}\nVersion: ${doc.meta.version}\nGenerated: ${doc.meta.createdAt}\nTone: ${doc.meta.tone}\n\n`;

  const sectionsText = doc.sections
    .map((s) => `## ${s.title}\n\n${s.body}\n`)
    .join("\n");

  return {
    meta: doc.meta,
    estimate: doc.estimate,
    fullText: header + sectionsText,
  };
}