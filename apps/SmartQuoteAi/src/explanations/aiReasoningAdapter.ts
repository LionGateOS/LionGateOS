/* ============================================================
   FILE: aiReasoningAdapter.ts
   PHASE 4.3 — AI REASONING ADAPTER (OFF BY DEFAULT)

   Purpose:
   - Provide a safe, typed adapter boundary for future AI reasoning.
   - Enforce "speech" constraints at the adapter level.
   - Remain inert unless explicitly enabled via feature flag.

   Notes:
   - This file is intentionally self-contained (no imports) to avoid
     dependency coupling during early phases.
   - It is NOT wired into UI or estimator logic yet.
   ============================================================ */

export const AI_REASONING_ENABLED = false;

/* ============================================================
   Phase 4.2 Input Shape (adapter-side)
   ============================================================ */

export type AIConfidence = "LOW" | "MED" | "HIGH";

export type AISpeechTone = "calm" | "neutral" | "firm";

export type AIRiskTag =
  | "scope"
  | "assumptions"
  | "responsibility"
  | "exclusions"
  | "dependencies"
  | "change_orders"
  | "pricing_volatility"
  | "schedule_risk"
  | "site_conditions";

export type AIDomainGuard = {
  /** If false, adapter must return disabled/no-output */
  allowed: boolean;
  /** Human-readable reason if disallowed */
  reason?: string;
};

/**
 * Phase 4.2 canonical input bundle (minimal, conservative).
 * Keep this stable: downstream UI can pass richer data later,
 * but adapter must remain safe if fields are missing.
 */
export type AIReasoningInput = {
  // Context
  projectName?: string;
  workType?: string;
  locale?: string;

  // Pricing summary (read-only inputs)
  enteredPrice?: number; // "client price" or quick check price
  estimatedCost?: number; // base + overhead + tax (as computed elsewhere)
  marginPct?: number; // derived elsewhere; adapter does not compute pricing

  // Line items (optional)
  lineItems?: Array<{
    label: string;
    quantity: number;
    unit: string;
    unitCost: number;
    lineTotal?: number;
  }>;

  // Deterministic engine outputs (optional)
  assessment?: "underpriced" | "reasonable" | "risky" | null;

  // Risk controls (optional)
  riskControls?: {
    laborRiskPct?: number;
    materialRiskPct?: number;
    contingencyPct?: number;
    targetProfitPct?: number;
  };

  // Governance
  guard?: AIDomainGuard;

  // Extra signals (optional)
  tags?: AIRiskTag[];
};

/* ============================================================
   Phase 4.1 AI Speech Contract (adapter-side enforcement)
   ============================================================ */

export type AISpeechContract = {
  // Hard constraints (never violate)
  noLegalAdvice: true;
  noMedicalAdvice: true;
  noFinancialAdvice: true;

  // Behavioral constraints
  noGuarantees: true;
  noHiddenAssumptions: true;
  noFabrication: true;

  // Output style constraints
  tone: AISpeechTone;
  maxBullets: number;
  maxCharsPerBullet: number;

  // Safety UX
  requirePlainLanguage: true;
};

export const DEFAULT_AI_SPEECH_CONTRACT: AISpeechContract = {
  noLegalAdvice: true,
  noMedicalAdvice: true,
  noFinancialAdvice: true,

  noGuarantees: true,
  noHiddenAssumptions: true,
  noFabrication: true,

  tone: "calm",
  maxBullets: 7,
  maxCharsPerBullet: 160,

  requirePlainLanguage: true,
};

/* ============================================================
   Adapter Output (Phase 4.3)
   ============================================================ */

export type AIReasoningOutput = {
  enabled: boolean;
  confidence: AIConfidence;
  bullets: string[];
  meta: {
    source: "disabled" | "adapter-only" | "ai";
    contract: AISpeechContract;
    warnings: string[];
  };
};

/* ============================================================
   Validation helpers (no external deps)
   ============================================================ */

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function clampInt(n: number, min: number, max: number): number {
  const x = Math.round(n);
  return Math.min(max, Math.max(min, x));
}

function safeString(s: unknown): string {
  return typeof s === "string" ? s : "";
}

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

function sanitizeBullet(text: string, maxChars: number): string {
  const t = normalizeWhitespace(text);
  // Remove any accidental “guarantee” language (soft guard; adapter should not promise outcomes)
  const noGuarantee = t
    .replace(/\bguarantee\b/gi, "aim")
    .replace(/\bguaranteed\b/gi, "aimed");
  return truncate(noGuarantee, maxChars);
}

function enforceContract(bullets: string[], contract: AISpeechContract): string[] {
  const maxBullets = clampInt(contract.maxBullets, 1, 12);
  const maxChars = clampInt(contract.maxCharsPerBullet, 60, 240);

  const cleaned = bullets
    .map((b) => sanitizeBullet(b, maxChars))
    .filter((b) => b.length > 0);

  return cleaned.slice(0, maxBullets);
}

function guardAllows(input: AIReasoningInput): { ok: boolean; warning?: string } {
  if (!input.guard) return { ok: true };
  if (input.guard.allowed) return { ok: true };
  return { ok: false, warning: input.guard.reason || "AI output is disabled by policy." };
}

/* ============================================================
   Deterministic adapter-only reasoning (NO AI)
   - Used even when AI is enabled later as a safe fallback.
   ============================================================ */

function buildAdapterOnlyBullets(input: AIReasoningInput): {
  bullets: string[];
  confidence: AIConfidence;
  warnings: string[];
} {
  const warnings: string[] = [];

  const projectName = safeString(input.projectName) || "this project";
  const assessment = input.assessment ?? null;

  const enteredPrice = isFiniteNumber(input.enteredPrice) ? input.enteredPrice : null;
  const estimatedCost = isFiniteNumber(input.estimatedCost) ? input.estimatedCost : null;
  const marginPct = isFiniteNumber(input.marginPct) ? input.marginPct : null;

  const risk = input.riskControls || {};
  const riskLoad =
    (isFiniteNumber(risk.laborRiskPct) ? risk.laborRiskPct : 0) +
    (isFiniteNumber(risk.materialRiskPct) ? risk.materialRiskPct : 0) +
    (isFiniteNumber(risk.contingencyPct) ? risk.contingencyPct : 0);

  const bullets: string[] = [];

  // 1) High-level framing (no decisions, no advice)
  bullets.push(
    `This summary explains pricing logic for ${projectName} using your entered line items and settings.`
  );

  // 2) Assessment echo (deterministic engine result)
  if (assessment) {
    if (assessment === "reasonable")
      bullets.push("Current check: the estimate appears reasonable based on the inputs provided.");
    if (assessment === "underpriced")
      bullets.push("Current check: the estimate may be underpriced; review overhead and unknowns before sending.");
    if (assessment === "risky")
      bullets.push("Current check: the estimate looks risky; consider clarifying scope and adding buffer if needed.");
  } else {
    bullets.push("Current check: add line items or a client price to enable a meaningful assessment.");
  }

  // 3) Numbers transparency (only if present)
  if (enteredPrice !== null) bullets.push(`Entered / client price lens: $${enteredPrice.toFixed(2)}.`);
  if (estimatedCost !== null)
    bullets.push(`Estimated cost lens (base + overhead + tax): $${estimatedCost.toFixed(2)}.`);
  if (marginPct !== null) bullets.push(`Effective margin lens: ${marginPct.toFixed(1)}%.`);

  // 4) Risk load transparency
  if (riskLoad > 0)
    bullets.push(
      `Risk load (labor + materials + contingency): +${riskLoad.toFixed(
        0
      )}% (exploration only; does not change saved estimates).`
    );

  // 5) Scope and change drivers (plain language)
  bullets.push("Price changes typically come from quantity changes, site conditions, schedule friction, or material volatility.");
  bullets.push("Scope is defined by the line items; work not listed is excluded unless added in writing.");

  // Confidence (simple heuristic)
  let confidence: AIConfidence = "LOW";
  const hasLineItems = Array.isArray(input.lineItems) && input.lineItems.length > 0;
  if (hasLineItems && enteredPrice !== null) confidence = "MED";
  if (hasLineItems && enteredPrice !== null && assessment === "reasonable") confidence = "HIGH";

  if (!hasLineItems) warnings.push("No line items detected: explanation is necessarily limited.");
  if (enteredPrice === null) warnings.push("No entered/client price detected: some lenses are unavailable.");

  return { bullets, confidence, warnings };
}

/* ============================================================
   Main Adapter Entry
   ============================================================ */

export function runAIReasoningAdapter(
  input: AIReasoningInput,
  contract: AISpeechContract = DEFAULT_AI_SPEECH_CONTRACT
): AIReasoningOutput {
  // Governance guard (hard stop)
  const g = guardAllows(input);
  if (!g.ok) {
    return {
      enabled: false,
      confidence: "LOW",
      bullets: [],
      meta: {
        source: "disabled",
        contract,
        warnings: [g.warning || "AI disabled by policy."],
      },
    };
  }

  // Feature flag OFF: return adapter-only deterministic bullets (still useful, safe)
  if (!AI_REASONING_ENABLED) {
    const built = buildAdapterOnlyBullets(input);
    const bullets = enforceContract(built.bullets, contract);

    return {
      enabled: false,
      confidence: built.confidence,
      bullets,
      meta: {
        source: "adapter-only",
        contract,
        warnings: built.warnings,
      },
    };
  }

  // Feature flag ON (future):
  // - This is where an actual AI call would happen.
  // - For now, we still return deterministic output to remain safe and non-breaking.
  const built = buildAdapterOnlyBullets(input);
  const bullets = enforceContract(built.bullets, contract);

  return {
    enabled: true,
    confidence: built.confidence,
    bullets,
    meta: {
      source: "ai",
      contract,
      warnings: [
        "AI_REASONING_ENABLED is true, but the adapter currently uses deterministic fallback (no model call wired yet).",
        ...built.warnings,
      ],
    },
  };
}
