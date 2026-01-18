import type { ProposalDocument, ProposalRequestPayload, ProposalSection } from "../types/proposal";

/**
 * Phase 7 – AI Narrative Engine (rule-based Hybrid Adaptive tone).
 *
 * This module extends the Phase 6 Proposal Intelligence Engine with:
 * - Hybrid tone model that adapts based on deal size band
 * - Richer transitions and connective language across sections
 * - Slightly different narrative flavours for different investment levels
 *
 * Still fully deterministic and local (no external AI calls).
 */

type DealBand = "none" | "small" | "medium" | "large" | "enterprise";

/**
 * Decide a deal size band from the estimated total with buffer.
 */
function getDealBand(total: number): DealBand {
  if (!total || total <= 0) return "none";
  if (total < 5000) return "small";
  if (total < 25000) return "medium";
  if (total < 75000) return "large";
  return "enterprise";
}

/**
 * Choose a tone label and micro-style hints based on the band.
 * This is the Hybrid Adaptive model:
 *  - small      -> friendly / collaborative
 *  - medium     -> consultant / advisory
 *  - large+     -> executive / formal
 */
function getToneConfig(band: DealBand) {
  switch (band) {
    case "small":
      return {
        label: "friendly-collaborative",
        opener:
          "We propose a compact, collaborative engagement designed to deliver value quickly while keeping the process straightforward.",
        styleHint:
          "Use clear, human language and keep the emphasis on partnership and practical outcomes.",
      };
    case "medium":
      return {
        label: "consultant-professional",
        opener:
          "We recommend a structured, outcome-focused engagement that balances rigor with pragmatism.",
        styleHint:
          "Use confident, advisory language and connect the work directly to business outcomes.",
      };
    case "large":
      return {
        label: "executive-formal",
        opener:
          "We recommend a structured engagement with clear governance, decision points, and measured milestones.",
        styleHint:
          "Use formal, precise language and highlight risk control, alignment, and accountability.",
      };
    case "enterprise":
      return {
        label: "executive-enterprise",
        opener:
          "We propose an enterprise-grade engagement with defined governance, phased deployment, and robust change management.",
        styleHint:
          "Use board-ready language, emphasising governance, scale, and long-term value.",
      };
    default:
      return {
        label: "neutral",
        opener:
          "This proposal outlines a structured engagement to design, configure, and deliver the SmartQuoteAI Pro solution.",
        styleHint:
          "Use neutral, clear wording suitable for a variety of client contexts.",
      };
  }
}

export function buildProposal(payload: ProposalRequestPayload): ProposalDocument {
  const now = new Date();
  const total = payload.estimate.totalWithBuffer;
  const currency = payload.estimate.currency || "USD";
  const band = getDealBand(total);
  const tone = getToneConfig(band);

  const meta = {
    clientName: payload.clientName,
    projectName: payload.projectName,
    version: "7.0.0",
    createdAt: now.toISOString(),
    preparedBy: payload.preparedBy ?? "SmartQuoteAI Pro",
    // These optional metadata fields can be ignored by older consumers
    tone: tone.label,
    dealBand: band,
  };

  const sections: ProposalSection[] = [];

  // --- Executive Summary ---
  const userSummary = payload.summary.trim();
  const baseSummary =
    userSummary ||
    "This proposal outlines a structured engagement to design, configure, and deliver the SmartQuoteAI Pro solution for the client. The aim is to provide a reliable, repeatable way to produce professional estimates and proposals that support better commercial decisions.";

  let bandQualifier: string;
  switch (band) {
    case "small":
      bandQualifier =
        " The focus is on achieving tangible outcomes quickly with a light governance footprint and minimal friction for the delivery team.";
      break;
    case "medium":
      bandQualifier =
        " At this level of investment, the engagement balances structure and flexibility, ensuring that governance, decision rights, and workflows are clear without becoming bureaucratic.";
      break;
    case "large":
      bandQualifier =
        " Given the scale of the engagement, the implementation will be supported by clear governance, stakeholder alignment, and phased milestones to manage risk and complexity.";
      break;
    case "enterprise":
      bandQualifier =
        " For an enterprise-scale engagement, the proposal reflects the need for robust governance, multi-stakeholder alignment, and a carefully staged rollout across business units.";
      break;
    default:
      bandQualifier =
        " The engagement is designed to be structured but pragmatic, supporting the client in moving from ad-hoc proposals to a consistent, professional process.";
  }

  const execSummary = [
    baseSummary,
    " ",
    tone.opener,
    " ",
    bandQualifier,
  ].join("");

  sections.push({
    id: "executive-summary",
    title: "Executive Summary",
    body: execSummary,
  });

  // --- Objectives & Outcomes ---
  const objectiveLines: string[] = [];

  objectiveLines.push(
    "• Establish SmartQuoteAI Pro as the trusted system of record for estimates and proposals, reducing reliance on disconnected documents and spreadsheets."
  );
  objectiveLines.push(
    "• Improve the clarity, consistency, and professionalism of all client-facing commercial documents."
  );

  if (band === "large" || band === "enterprise") {
    objectiveLines.push(
      "• Provide leadership with better visibility into pipeline quality, pricing discipline, and commercial performance across teams or business units."
    );
    objectiveLines.push(
      "• Reduce delivery and reputational risk by ensuring that scope, assumptions, and pricing logic are clearly documented and repeatable."
    );
  } else {
    objectiveLines.push(
      "• Give sales and delivery teams a simple, reusable workflow they can rely on, without adding unnecessary operational overhead."
    );
  }

  const objectivesBody =
    "The engagement is expected to deliver the following outcomes: " +
    objectiveLines.join(" ");

  sections.push({
    id: "objectives",
    title: "Objectives & Expected Outcomes",
    body: objectivesBody,
  });

  // --- Scope of Work ---
  const scopeParts: string[] = [];

  scopeParts.push(
    `The scope of work covers configuration, implementation, and rollout of SmartQuoteAI Pro for the project "${payload.projectName}".`
  );
  scopeParts.push(
    "While the detailed scope will be refined collaboratively during discovery, typical activities include environment and workspace configuration, preset and template setup, workflow definition, and enablement on best-practice usage."
  );

  if (payload.assumptions && payload.assumptions.trim().length > 0) {
    scopeParts.push(
      "The current scope has been framed around the following working assumptions: " +
        payload.assumptions.trim()
    );
  } else {
    scopeParts.push(
      "The scope described here is based on a set of standard assumptions about access to stakeholders, availability of existing materials, and reasonable turnaround times for feedback and approvals."
    );
  }

  const scopeBody = scopeParts.join(" ");

  sections.push({
    id: "scope",
    title: "Scope of Work",
    body: scopeBody,
  });

  // --- Implementation Approach & Timeline ---
  const implParts: string[] = [];

  if (band === "small") {
    implParts.push(
      "Implementation will follow a compact, fast-track approach. We anticipate a short discovery phase, focused configuration, and a rapid handover supported by concise training materials."
    );
  } else if (band === "medium") {
    implParts.push(
      "Implementation will be delivered in structured phases: discovery and alignment, detailed configuration and validation, a focused pilot with a core user group, and then a wider rollout."
    );
  } else if (band === "large" || band === "enterprise") {
    implParts.push(
      "Implementation will follow a staged approach aligned to the client's governance model. This typically includes discovery and stakeholder alignment, solution and integration design, configuration and technical enablement, controlled pilot, and scaled rollout across the relevant teams or business units."
    );
  } else {
    implParts.push(
      "Implementation will be structured to move from discovery to configuration and rollout in a controlled but efficient manner, with checkpoints to ensure that the solution remains aligned to priorities."
    );
  }

  implParts.push(
    "Throughout the engagement, we will provide guidance on how to use SmartQuoteAI Pro effectively and adjust configuration based on real-world usage and feedback from your team."
  );

  const implBody = implParts.join(" ");

  sections.push({
    id: "implementation-plan",
    title: "Implementation Approach & Timeline",
    body: implBody,
  });

  // --- Investment & Commercial Overview ---
  const investParts: string[] = [];
  const totalFormatted = total > 0 ? total.toLocaleString() : "TBD";

  investParts.push(
    "Based on the current understanding of scope and priorities, the total investment for this engagement is estimated at " +
      (total > 0 ? `${currency} ${totalFormatted}` : "a to-be-confirmed amount") +
      ", inclusive of a risk buffer."
  );
  investParts.push(
    "This figure should be treated as an indicative working estimate rather than a final fixed quote. It may be refined as scope, constraints, and implementation options are clarified."
  );

  if (band === "small") {
    investParts.push(
      "At this level, the emphasis is on achieving clear outcomes with a lean delivery footprint and minimal process overhead."
    );
  } else if (band === "medium") {
    investParts.push(
      "For a mid-sized engagement, the investment reflects both configuration effort and the value of introducing clearer structure, governance, and repeatability into the sales and delivery process."
    );
  } else if (band === "large" || band === "enterprise") {
    investParts.push(
      "For a large-scale or enterprise engagement, the investment accounts for the complexity of multi-stakeholder alignment, governance, integration touchpoints, and phased rollout across teams."
    );
  }

  const investBody = investParts.join(" ");

  sections.push({
    id: "investment",
    title: "Investment & Commercial Overview",
    body: investBody,
  });

  // --- Risks & Considerations ---
  const userRisks = payload.risks?.trim();
  const riskBase =
    "As with any initiative that touches pricing, proposals, and sales workflow, there are inherent risks related to adoption, data quality, and change management.";

  let riskText: string;
  if (userRisks && userRisks.length > 0) {
    riskText =
      riskBase +
      " In addition, the following specific risks have been identified for this engagement: " +
      userRisks;
  } else {
    riskText =
      riskBase +
      " Typical risks include misalignment on decision rights, incomplete or inconsistent inputs, and limited time from key stakeholders. These can be mitigated through clear ownership, early communication, and a realistic implementation schedule.";
  }

  sections.push({
    id: "risks",
    title: "Risks & Considerations",
    body: riskText,
  });

  // --- Assumptions (optional) ---
  if (payload.assumptions && payload.assumptions.trim().length > 0) {
    sections.push({
      id: "assumptions",
      title: "Key Assumptions",
      body:
        "This proposal has been constructed using the following working assumptions: " +
        payload.assumptions.trim(),
    });
  }

  // --- Next Steps ---
  const nextParts: string[] = [];

  nextParts.push(
    "If the client is comfortable with the direction, scope, and indicative investment outlined in this document, the next step is to confirm the engagement and align on a start date."
  );
  nextParts.push(
    "We recommend scheduling a short working session to validate assumptions, confirm priorities, and agree on the detailed delivery plan and governance rhythm."
  );

  if (band === "large" || band === "enterprise") {
    nextParts.push(
      "For a larger or enterprise-scale engagement, we also suggest identifying an executive sponsor and a core working group to support decision-making and unblock execution."
    );
  }

  const nextBody = nextParts.join(" ");

  sections.push({
    id: "next-steps",
    title: "Next Steps",
    body: nextBody,
  });

  return {
    meta,
    estimate: payload.estimate,
    sections,
  };
}
