import React, { useEffect, useMemo, useState, useRef } from "react";
import { ExplanationPanel } from "./components/ExplanationPanel";
import type { EstimateDraft } from "../logic/EstimatorEngine";


/* =========================
   AI availability surface (UI-only, non-blocking)
   - Read-only indicator, no AI calls
   - Default: unknown
   - Optional: external systems may set localStorage key "lg_ai_availability_v1"
   ========================= */

type AIAvailabilityState = "available" | "degraded" | "offline" | "unknown";

const AI_AVAILABILITY_KEY = "lg_ai_availability_v1";

function readAIAvailability(): AIAvailabilityState {
  const raw = safeLocalStorageGet(AI_AVAILABILITY_KEY);
  if (!raw) return "unknown";
  const v = raw.toLowerCase();
  if (v === "available" || v === "degraded" || v === "offline" || v === "unknown") return v as AIAvailabilityState;
  return "unknown";
}

function aiStatusLabel(s: AIAvailabilityState): string {
  if (s === "available") return "Available";
  if (s === "degraded") return "Limited";
  if (s === "offline") return "Unavailable";
  return "Unknown";
}

function aiStatusDetail(s: AIAvailabilityState): string {
  if (s === "available") return "AI insights can be requested via LionGateOS (approval-gated).";
  if (s === "degraded") return "AI insights may be rate-limited or partially disabled. Estimator remains fully usable.";
  if (s === "offline") return "AI insights are off. Estimator remains fully usable.";
  return "AI status has not been reported yet. Estimator remains fully usable.";
}

import {
  addLineItem,
  buildEmptyDraft,
  calculateTotals,
  evaluateEstimate,
} from "../logic/EstimatorEngine";

type Assessment = "underpriced" | "reasonable" | "risky";
type WorkType = "residential" | "commercial" | "service" | "custom";

const EXAMPLE_DISMISSED_KEY = "sqai_estimator_example_dismissed_v1";

const SNAPSHOTS_KEY = "sqai_estimator_snapshots_v1";

const SAVED_ESTIMATES_KEY = "sqai_estimator_saved_estimates_v1";
const PRO_DEMO_KEY = "sqai_estimator_pro_demo_v1";
const MONTHLY_USAGE_KEY = "sqai_estimator_monthly_usage_v1";

type SavedEstimate = {
  id: string;
  ts: number;
  name: string;
  note: string;
  draft: EstimateDraft;
  workType: WorkType;
  quickInput: string;
};

type MonthlyUsage = {
  monthKey: string; // YYYY-MM
  saves: number;
};

function monthKeyNow(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "null";
  }
}

function draftFingerprint(draft: EstimateDraft, workType: WorkType, quickInput: string): string {
  // Stable-ish snapshot fingerprint for "what changed" (best-effort).
  return safeJsonStringify({ draft, workType, quickInput });
}

type EstimateSnapshot = {
  id: string;
  ts: number;
  label: string;
  draft: EstimateDraft;
  workType: WorkType;
  quickInput: string;
};

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/* =========================
   Formatting & utilities
   ========================= */

function formatMoney(value: number): string {
  const n = Number.isFinite(value) ? value : 0;
  return `$${n.toFixed(2)}`;
}

function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.+-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/* =========================
   Intent inference (additive)
   ========================= */

type InferredDimension = "area" | "length" | "time" | "count" | null;

type InferenceResult = {
  dimension: InferredDimension;
  unit: string | null;
  confidence: "low" | "medium" | "high";
  reason: string;
};

// Very conservative, heuristic-based inference.
// Silent, non-invasive: never overwrites unless user accepts.
function inferFromLabelAndQty(label: string, qtyRaw: string): InferenceResult | null {
  const text = label.toLowerCase();
  const qty = parseNumber(qtyRaw);

  if (!text || qty === null || qty <= 0) return null;

  // Keyword buckets
  const areaKeys = ["sq ft", "sqft", "square foot", "drywall", "paint", "floor", "ceiling", "tile"];
  const lengthKeys = ["linear", "lf", "ft", "feet", "trench", "run", "wall"];
  const timeKeys = ["hour", "hours", "hr", "hrs", "labor", "install", "service"];
  const countKeys = ["each", "ea", "unit", "fixture", "outlet", "door", "window"];

  const hit = (keys: string[]) => keys.some((k) => text.includes(k));

  if (hit(areaKeys)) {
    return { dimension: "area", unit: "sq ft", confidence: "high", reason: "Detected area-related terms" };
  }
  if (hit(lengthKeys)) {
    return { dimension: "length", unit: "linear ft", confidence: "medium", reason: "Detected length-related terms" };
  }
  if (hit(timeKeys)) {
    return { dimension: "time", unit: "hours", confidence: "medium", reason: "Detected time/labor terms" };
  }
  if (hit(countKeys)) {
    return { dimension: "count", unit: "each", confidence: "low", reason: "Detected count-related terms" };
  }

  // Fallbacks based on magnitude hints (very soft)
  if (qty >= 50) {
    return { dimension: "area", unit: "sq ft", confidence: "low", reason: "Large quantity suggests area" };
  }

  return null;
}

// WorkType-aware inference (additive).
// Uses workType as a lightweight context signal to bias unit suggestions.
// Never enforces; only suggests. If no match, returns null and caller may fall back.
function inferFromLabelAndQtyWithWorkType(
  label: string,
  qtyRaw: string,
  workType: WorkType
): InferenceResult | null {
  const text = label.toLowerCase();
  const qty = parseNumber(qtyRaw);

  if (!text || qty === null || qty <= 0) return null;

  // Common keyword buckets (shared baseline)
  const common = {
    area: ["sq ft", "sqft", "square foot", "drywall", "paint", "floor", "ceiling", "tile"],
    length: ["linear", "lf", "ft", "feet", "trench", "run", "wall"],
    time: ["hour", "hours", "hr", "hrs", "labor", "install", "service"],
    count: ["each", "ea", "unit", "fixture", "outlet", "door", "window"],
  };

  // Trade biases by work type (kept conservative; additive-only tuning).
  // These keywords do not "win" by themselves unless they produce a clear signal.
  const biasByWorkType: Record<WorkType, Partial<typeof common>> = {
    residential: {
      area: ["drywall", "paint", "floor", "ceiling", "tile", "insulation", "shingles"],
      length: ["baseboard", "trim", "casing", "railing", "fence", "soffit"],
      time: ["handyman", "repair", "install", "service"],
      count: ["fixture", "door", "window", "outlet", "switch"],
    },
    commercial: {
      area: ["t-bar", "suspended ceiling", "carpet tile", "vct", "epoxy", "partition"],
      length: ["conduit", "trench", "pipe", "duct", "cable", "raceway"],
      time: ["commission", "service", "install", "supervision"],
      count: ["panel", "device", "head", "sprinkler", "light"],
    },
    service: {
      time: ["service", "diagnostic", "troubleshoot", "repair", "callout", "trip charge"],
      count: ["callout", "visit", "trip", "fixture", "outlet", "switch"],
      length: ["run", "wire", "pipe"],
      area: ["patch", "touch up"],
    },
    custom: {
      // Custom is intentionally light: do not overfit.
      area: ["custom", "feature wall", "accent wall"],
      length: ["custom", "built-in", "cabinet"],
      time: ["custom", "design", "consult"],
      count: ["custom", "piece", "unit"],
    },
  };

  const hit = (keys: string[]) => keys.some((k) => text.includes(k));

  // 1) Explicit unit mentions should win first (strongest signal)
  if (hit(["sq ft", "sqft", "square foot", "m2", "sqm", "square meter"])) {
    return { dimension: "area", unit: "sq ft", confidence: "high", reason: "Explicit area unit detected" };
  }
  if (hit(["linear ft", "lin ft", "lf", "feet", "ft", "metre", "meter", "m"])) {
    return { dimension: "length", unit: "linear ft", confidence: "high", reason: "Explicit length unit detected" };
  }
  if (hit(["hour", "hours", "hr", "hrs"])) {
    return { dimension: "time", unit: "hours", confidence: "high", reason: "Explicit time unit detected" };
  }
  if (hit(["each", "ea"])) {
    return { dimension: "count", unit: "each", confidence: "high", reason: "Explicit count unit detected" };
  }

  // 2) WorkType-biased keyword match (medium signal)
  const bias = biasByWorkType[workType];
  if (bias.area && hit(bias.area)) {
    return { dimension: "area", unit: "sq ft", confidence: "medium", reason: `Work type (${workType}) suggests area` };
  }
  if (bias.length && hit(bias.length)) {
    return { dimension: "length", unit: "linear ft", confidence: "medium", reason: `Work type (${workType}) suggests length` };
  }
  if (bias.time && hit(bias.time)) {
    return { dimension: "time", unit: "hours", confidence: "medium", reason: `Work type (${workType}) suggests time/labor` };
  }
  if (bias.count && hit(bias.count)) {
    return { dimension: "count", unit: "each", confidence: "low", reason: `Work type (${workType}) suggests count` };
  }

  // 3) Shared baseline (low signal)
  if (hit(common.area)) {
    return { dimension: "area", unit: "sq ft", confidence: "low", reason: "Detected common area-related terms" };
  }
  if (hit(common.length)) {
    return { dimension: "length", unit: "linear ft", confidence: "low", reason: "Detected common length-related terms" };
  }
  if (hit(common.time)) {
    return { dimension: "time", unit: "hours", confidence: "low", reason: "Detected common time/labor terms" };
  }
  if (hit(common.count)) {
    return { dimension: "count", unit: "each", confidence: "low", reason: "Detected common count-related terms" };
  }

  // 4) Very soft fallback by magnitude (kept intentionally conservative)
  if (qty >= 250) {
    return { dimension: "area", unit: "sq ft", confidence: "low", reason: "Very large quantity suggests area" };
  }

  return null;
}


/* =========================
   Component
   ========================= */

export default function EstimatorHome({ onUpdateTotal, userPlan }) {
  const lastEmittedTotal = useRef(0);
  const [draft, setDraft] = useState<EstimateDraft>(() => buildEmptyDraft());

  // Context only (no pricing impact yet)
  const [workType, setWorkType] = useState<WorkType>("residential");

  // Line item form fields
  const [itemLabel, setItemLabel] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [itemUnitCost, setItemUnitCost] = useState("");

  // Intent inference state (additive)
  const [inference, setInference] = useState<InferenceResult | null>(null);
  const [unitManuallyEdited, setUnitManuallyEdited] = useState(false);

  // Quick check
  const [quickInput, setQuickInput] = useState("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  // First-visit example state (calm, non-pushy)
  const [showExampleHint, setShowExampleHint] = useState(false);

  // Snapshots (additive, local-only)
  const [snapshotLabel, setSnapshotLabel] = useState("");
  const [snapshots, setSnapshots] = useState<EstimateSnapshot[]>(() => {
    const parsed = safeJsonParse<EstimateSnapshot[]>(safeLocalStorageGet(SNAPSHOTS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  });

  // Pro demo toggle (UI-only; no billing)
  const [proDemoEnabled, setProDemoEnabled] = useState<boolean>(() => {
    return safeLocalStorageGet(PRO_DEMO_KEY) === "1";
  });

  // AI availability (UI-only; reflects LionGateOS state if published to localStorage)
  const [aiStatus, setAiStatus] = useState<AIAvailabilityState>(() => readAIAvailability());



  // Saved estimates (additive, local-only)
  const [projectName, setProjectName] = useState("My Project");
  const [projectNote, setProjectNote] = useState("");
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>(() => {
    const parsed = safeJsonParse<SavedEstimate[]>(safeLocalStorageGet(SAVED_ESTIMATES_KEY));
    return Array.isArray(parsed) ? parsed : [];
  });

  // Monthly usage (soft limits for Free tier; stored locally)
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage>(() => {
    const parsed = safeJsonParse<MonthlyUsage>(safeLocalStorageGet(MONTHLY_USAGE_KEY));
    const mk = monthKeyNow();
    if (!parsed || parsed.monthKey !== mk) return { monthKey: mk, saves: 0 };
    return parsed;
  });

  // Risk controls (read-only impact; does not mutate saved estimate unless user saves)
  const [laborRiskPct, setLaborRiskPct] = useState(8);      // %
  const [materialRiskPct, setMaterialRiskPct] = useState(6); // %
  const [contingencyPct, setContingencyPct] = useState(5);   // %
  const [targetProfitPct, setTargetProfitPct] = useState(15);// % target margin on price

  // Change tracking (since last save/restore)
  const [lastSavedFingerprint, setLastSavedFingerprint] = useState<string>(() =>
    draftFingerprint(draft, workType, quickInput)
  );

  const totals = useMemo(() => calculateTotals(draft), [draft]);

  // Risk & Exposure (additive, read-only)
  const riskInsights = useMemo(() => {
    const items = draft.items || [];
    const base = Number.isFinite(totals.baseCost) ? totals.baseCost : 0;
    const grand = Number.isFinite(totals.grandTotal) ? totals.grandTotal : 0;

    const normalize = (s: string) => (s || "").toLowerCase();
    const hasAny = (hay: string, needles: string[]) => needles.some((n) => hay.includes(n));

    const laborKeys = ["labor", "labour", "install", "service", "repair", "demo", "demolition", "frame", "framing", "finish", "finishing", "hang", "tape", "mud", "paint"];
    const materialKeys = ["material", "lumber", "wood", "drywall", "tile", "shingle", "insulation", "concrete", "mix", "adhesive", "grout", "nail", "screw", "fastener", "wire", "cable", "pipe", "pvc", "copper"];
    const contingencyKeys = ["contingency", "buffer", "allowance", "misc", "unknown", "unforeseen"];

    let laborCost = 0;
    let materialCost = 0;
    let otherCost = 0;

    let hasTimeUnit = false;
    let hasAreaUnit = false;
    let hasLengthUnit = false;

    let hasContingency = false;

    for (const it of items) {
      const label = normalize(it.label);
      const unit = normalize(it.unit);
      const line = Number.isFinite(it.quantity) && Number.isFinite(it.unitCost) ? it.quantity * it.unitCost : 0;

      const timeUnit = hasAny(unit, ["hour", "hours", "hr", "hrs"]);
      const areaUnit = hasAny(unit, ["sq ft", "sqft", "square foot", "sqm", "m2"]);
      const lengthUnit = hasAny(unit, ["linear", "lf", "lin", "ft", "feet", "meter", "metre", "m"]);

      if (timeUnit) hasTimeUnit = true;
      if (areaUnit) hasAreaUnit = true;
      if (lengthUnit) hasLengthUnit = true;

      if (hasAny(label, contingencyKeys)) hasContingency = true;

      // Heuristic split (soft, explainable)
      if (timeUnit || hasAny(label, laborKeys)) laborCost += line;
      else if (hasAny(label, materialKeys)) materialCost += line;
      else otherCost += line;
    }

    const totalDetected = laborCost + materialCost + otherCost;
    const safeBase = base > 0 ? base : totalDetected;

    const laborShare = safeBase > 0 ? laborCost / safeBase : 0;
    const materialShare = safeBase > 0 ? materialCost / safeBase : 0;

    const fewLineItems = items.length > 0 && items.length <= 2;
    const emptyOrTiny = items.length === 0;

    const structureLines: string[] = [];
    const assumptionLines: string[] = [];
    const sensitivityLines: string[] = [];

    if (emptyOrTiny) {
      structureLines.push("Add line items to see a meaningful risk breakdown.");
      assumptionLines.push("No assumptions can be assessed until line items exist.");
      sensitivityLines.push("Sensitivity insights appear after you add at least one line item.");
      return { structureLines, assumptionLines, sensitivityLines };
    }

    // Cost structure framing
    if (laborShare >= 0.6) structureLines.push("Labor-heavy estimate: schedule changes and rework can impact profit more than materials.");
    else if (materialShare >= 0.6) structureLines.push("Material-heavy estimate: pricing volatility and waste rates matter more than labor variance.");
    else structureLines.push("Mixed cost structure: both labor and materials can move the result.");

    if (hasTimeUnit) structureLines.push("Time-based units detected (hours): overruns typically come from scope creep and on-site friction.");
    if (hasAreaUnit) structureLines.push("Area-based units detected (sq ft): measure accuracy and waste factors become important.");
    if (hasLengthUnit && !hasAreaUnit) structureLines.push("Length-based units detected (linear ft): field conditions often change measured runs.");

    // Tie-in to existing assessment (without changing it)
    if (assessment === "underpriced") structureLines.push("Current assessment suggests limited buffer: double-check overhead and unknowns.");
    if (assessment === "risky") structureLines.push("Current assessment suggests high exposure: consider adding buffer or clarifying scope before sending.");

    // Assumptions
    if (!hasContingency) assumptionLines.push("No explicit contingency line item detected (buffer / allowance).");
    if (fewLineItems) assumptionLines.push("Scope is represented by very few line items — assumptions may be broad.");
    assumptionLines.push(`Work type context: ${workType.replace("_", " ")} (used only for context, not pricing).`);

    // Sensitivity (statement-based, calm)
    const laborOverrun = laborCost * 0.1;
    const materialOverrun = materialCost * 0.1;

    if (laborCost > 0) sensitivityLines.push(`A 10% labor overrun would add about ${formatMoney(laborOverrun)} to costs.`);
    if (materialCost > 0) sensitivityLines.push(`A 10% material increase would add about ${formatMoney(materialOverrun)} to costs.`);

    // If we have a grand total, give a gentle relative framing (no profit math assumed)
    if (grand > 0 && safeBase > 0) {
      const buffer = grand - safeBase;
      sensitivityLines.push(`Current buffer between base cost and client price is about ${formatMoney(buffer)} (before overhead/tax effects).`);
    }

    // Ensure minimum lines for UX consistency
    if (assumptionLines.length < 2) assumptionLines.push("Assumptions are best validated with site conditions and scope notes.");
    if (sensitivityLines.length < 2) sensitivityLines.push("Sensitivity improves as you tag labor vs materials more explicitly.");

    return { structureLines, assumptionLines, sensitivityLines };
  }, [draft, totals, assessment, workType]);


  // Seed a gentle example on first visit only (until dismissed).
  useEffect(() => {
    const dismissed = safeLocalStorageGet(EXAMPLE_DISMISSED_KEY);
    if (dismissed) return;

    // Only seed if the draft is empty (avoid repeated seeding).
    if (draft.items.length > 0) return;

    const seeded = addLineItem(buildEmptyDraft(), {
      label: "Example: Frame basement wall (edit or remove)",
      quantity: 100,
      unit: "sq ft",
      unitCost: 12.5,
      costType: "other",
    });

    setDraft(seeded);
    setShowExampleHint(true);
    // Intentionally NOT marking dismissed yet. User can keep or clear it.
  }, [draft.items.length]);

  function clearExampleAndStartBlank() {
    setDraft(buildEmptyDraft());
    setAssessment(null);
    setQuickInput("");
    setShowExampleHint(false);
    safeLocalStorageSet(EXAMPLE_DISMISSED_KEY, "1");
  }

  // Passive inference watcher (additive, silent)
  useEffect(() => {
    if (unitManuallyEdited) {
      setInference(null);
      return;
    }
    const workAware = inferFromLabelAndQtyWithWorkType(itemLabel, itemQty, workType);
    const fallback = workAware || inferFromLabelAndQty(itemLabel, itemQty);
    setInference(fallback);
  }, [itemLabel, itemQty, unitManuallyEdited, workType]);
  
  // Persist snapshots (additive, best-effort)
  useEffect(() => {
    // Keep a reasonable cap to avoid unbounded storage growth.
    const capped = snapshots.slice(0, 30);
    safeLocalStorageSet(SNAPSHOTS_KEY, JSON.stringify(capped));
  }, [snapshots]);
  
  useEffect(() => {
    safeLocalStorageSet(PRO_DEMO_KEY, proDemoEnabled ? "1" : "0");
  }, [proDemoEnabled]);

  // AI availability listener (UI-only)
  useEffect(() => {
    const sync = () => setAiStatus(readAIAvailability());
    sync();

    function onStorage(e: StorageEvent) {
      if (e.key === AI_AVAILABILITY_KEY) sync();
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);



  useEffect(() => {
    // Keep reasonable cap to avoid unbounded growth.
    const capped = savedEstimates.slice(0, 50);
    safeLocalStorageSet(SAVED_ESTIMATES_KEY, JSON.stringify(capped));
  }, [savedEstimates]);

  useEffect(() => {
    safeLocalStorageSet(MONTHLY_USAGE_KEY, JSON.stringify(monthlyUsage));
  }, [monthlyUsage]);

  function acceptSuggestedUnit() {
    if (!inference?.unit) return;
    setItemUnit(inference.unit);
    setUnitManuallyEdited(false);
  }

  function saveSnapshot() {
    const label = snapshotLabel.trim() || "Snapshot";
    const ts = Date.now();
    const id = `${ts}_${Math.random().toString(16).slice(2)}`;

    // Deep clone draft to ensure snapshot is immutable.
    const draftClone = JSON.parse(JSON.stringify(draft)) as EstimateDraft;

    const next: EstimateSnapshot = {
      id,
      ts,
      label,
      draft: draftClone,
      workType,
      quickInput,
    };

    setSnapshots((prev) => [next, ...prev]);
    setSnapshotLabel("");
  }

  function restoreSnapshot(s: EstimateSnapshot) {
    setDraft(s.draft);
    setWorkType(s.workType);
    setQuickInput(s.quickInput);
    setAssessment(null);
  }

  function deleteSnapshot(id: string) {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }

  function clearAllSnapshots() {
    setSnapshots([]);
  }

  function bumpMonthlySaves() {
    const mk = monthKeyNow();
    setMonthlyUsage((prev) => {
      const next = prev.monthKey === mk ? { ...prev, saves: prev.saves + 1 } : { monthKey: mk, saves: 1 };
      return next;
    });
  }

  function canSaveMoreThisMonth(): boolean {
    // Soft gate: Free tier gets 10 saves/month (local-only demo).
    if (proDemoEnabled) return true;
    return monthlyUsage.saves < 10;
  }

  function saveCurrentEstimate() {
    if (!canSaveMoreThisMonth()) return;

    const name = (projectName || "Untitled").trim() || "Untitled";
    const note = (projectNote || "").trim();
    const ts = Date.now();
    const id = `${ts}_${Math.random().toString(16).slice(2)}`;

    const draftClone = JSON.parse(JSON.stringify(draft)) as EstimateDraft;

    const next: SavedEstimate = {
      id,
      ts,
      name,
      note,
      draft: draftClone,
      workType,
      quickInput,
    };

    setSavedEstimates((prev) => [next, ...prev]);
    bumpMonthlySaves();
    setLastSavedFingerprint(draftFingerprint(draftClone, workType, quickInput));
  }

  function restoreSavedEstimate(e: SavedEstimate) {
    setDraft(e.draft);
    setWorkType(e.workType);
    setQuickInput(e.quickInput);
    setProjectName(e.name || "My Project");
    setProjectNote(e.note || "");
    setAssessment(null);
    setLastSavedFingerprint(draftFingerprint(e.draft, e.workType, e.quickInput));
  }

  function duplicateSavedEstimate(e: SavedEstimate) {
    const ts = Date.now();
    const id = `${ts}_${Math.random().toString(16).slice(2)}`;
    const draftClone = JSON.parse(JSON.stringify(e.draft)) as EstimateDraft;

    const next: SavedEstimate = {
      id,
      ts,
      name: `${e.name || "Estimate"} (copy)`,
      note: e.note || "",
      draft: draftClone,
      workType: e.workType,
      quickInput: e.quickInput,
    };

    setSavedEstimates((prev) => [next, ...prev]);
  }

  function deleteSavedEstimate(id: string) {
    setSavedEstimates((prev) => prev.filter((x) => x.id !== id));
  }

  function clearAllSavedEstimates() {
    setSavedEstimates([]);
  }

  function printEstimate() {
    try {
      window.print();
    } catch {
      // ignore
    }
  }

  function handleAddLineItem() {
    const qty = parseNumber(itemQty);
    const unitCost = parseNumber(itemUnitCost);

    if (!itemLabel.trim()) return;
    if (qty === null || qty <= 0) return;
    if (unitCost === null || unitCost <= 0) return;

    const next = addLineItem(draft, {
      label: itemLabel.trim(),
      quantity: qty,
      unit: itemUnit.trim() || inference?.unit || "unit",
      unitCost: unitCost,
      costType: "other",
    });

    setDraft(next);
    setItemLabel("");
    setItemQty("");
    setItemUnit("");
    setItemUnitCost("");
    setInference(null);
    setUnitManuallyEdited(false);
    setAssessment(null);

    // Once they add a real line item, do not auto-seed examples again.
    safeLocalStorageSet(EXAMPLE_DISMISSED_KEY, "1");
    setShowExampleHint(false);
  }


function removeLineItemById(id: string) {
  setDraft((prev) => {
    const items = Array.isArray((prev as any).items) ? (prev as any).items : [];
    return { ...(prev as any), items: items.filter((x: any) => x.id !== id) } as any;
  });
  setAssessment(null);
}

function clearAllLineItems() {
  setDraft((prev) => {
    return { ...(prev as any), items: [] } as any;
  });
  setAssessment(null);
}

  function handleEvaluate() {
    const quick = parseNumber(quickInput);

    if (quick !== null && quick > 0) {
      const synthetic = buildEmptyDraft();
      synthetic.items.push({
        id: "synthetic",
        label: "Quick check base",
        quantity: 1,
        unit: "job",
        unitCost: quick,
        costType: "other",
      });

      const t = calculateTotals(synthetic);
      const e = evaluateEstimate(t);
      setAssessment(e.assessment);
      return;
    }

    if (!draft.items.length) {
      setAssessment(null);
      return;
    }

    const e = evaluateEstimate(totals);
    setAssessment(e.assessment);
  }


  // Explanation panel model (additive, UI-only)
  const explanationConfidence = useMemo<"LOW" | "MED" | "HIGH">(() => {
    if (!draft.items.length && !parseNumber(quickInput)) return "LOW";
    if (assessment === "reasonable") return "HIGH";
    if (assessment === "underpriced") return "LOW";
    if (assessment === "risky") return "MED";
    return "MED";
  }, [assessment, draft.items.length, quickInput]);

  const explanationSource = useMemo(() => {
    const q = parseNumber(quickInput);
    if (q && q > 0) return "Quick check input";
    if (draft.items.length > 0) return "Line items";
    return "No inputs yet";
  }, [draft.items.length, quickInput]);

  const explanationText = useMemo(() => {
    if (draft.items.length > 0) {
      return "Your client price is derived from the line items you entered, plus overhead and tax assumptions configured in this estimator.";
    }
    const q = parseNumber(quickInput);
    if (q && q > 0) {
      return "This is a quick check using the client price you entered. Add line items to generate a line-by-line, defensible estimate.";
    }
    return "Add line items (recommended) or enter a quick client price to generate an explanation.";
  }, [draft.items.length, quickInput]);

  const explanationAssumptions = useMemo(() => {
    const list: string[] = [];
    if (draft.items.length === 0) list.push("No line items yet; explanation is limited.");
    list.push("Work type is context only and does not change pricing.");
    list.push("Totals include overhead and tax estimates based on your current settings.");
    return list;
  }, [draft.items.length]);

  const explanationExclusions = useMemo(() => {
    const list: string[] = [];
    list.push("Work not listed in line items.");
    list.push("Hidden conditions not visible at time of estimate.");
    list.push("Client-requested changes after approval.");
    return list;
  }, []);

  const assessmentColor =
    assessment === "reasonable"
      ? "#7dd3a5"
      : assessment === "underpriced"
      ? "#fbbf24"
      : assessment === "risky"
      ? "#f87171"
      : "#e8ebf0";


  // Pricing lens (read-only): use Quick Check price when provided, else use computed grand total.
  const enteredPrice = (() => {
    const q = parseNumber(quickInput);
    return q !== null && q > 0 ? q : totals.grandTotal;
  })();

  const estimatedCost = totals.baseCost + totals.overheadCost + totals.taxAmount;
  const cushion = Math.max(0, enteredPrice - estimatedCost);
  const effectiveMarginPct = enteredPrice > 0 ? (cushion / enteredPrice) * 100 : 0;

  const riskLoadPct = laborRiskPct + materialRiskPct + contingencyPct;
  const riskAdjustedPrice = enteredPrice * (1 + riskLoadPct / 100);

  const targetPriceForMargin = (() => {
    const t = Math.max(1, Math.min(60, targetProfitPct));
    // price = cost / (1 - margin)
    const denom = 1 - t / 100;
    return denom > 0 ? estimatedCost / denom : estimatedCost;
  })();

  const changedSinceSave = (() => {
    const now = draftFingerprint(draft, workType, quickInput);
    return now !== lastSavedFingerprint;
  })();

  // SYNC ENGINE: Sends totals to the Main Magnets (Circuit Breaker Installed)
  React.useEffect(() => {
     if (onUpdateTotal && totals !== undefined) {
       // Only speak if the number is different from the last time we spoke
       if (Math.abs(lastEmittedTotal.current - totals.grandTotal) > 0.01) {
         lastEmittedTotal.current = totals.grandTotal;
         onUpdateTotal(totals.grandTotal);
       }
     }
  }, [totals?.grandTotal, onUpdateTotal]);

  const renderExpenses = () => {
    // VALUE LOGIC: Real-time Profit Analysis
    const monthlyBurn = 4250.00;
    const projectCost = totals.baseCost + totals.overheadCost; // Using deterministic costs
    const grossProfit = totals.grandTotal - projectCost;
    const burnCoverage = (grossProfit / monthlyBurn) * 100;
    
    return (
      <div style={{ padding: '20px 0', color: '#fff' }}>
        
        {/* MAIN PROFIT CARD */}
        <div style={{ 
          background: 'linear-gradient(145deg, #1a1a20, #0f0f12)', 
          padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' 
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#888', letterSpacing: '1px' }}>REALITY CHECK: PROFIT & BURN</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>NET PROFIT ON THIS JOB</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>${grossProfit.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>COVERS MONTHLY BURN</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: burnCoverage > 100 ? '#4caf50' : '#ff9800' }}>
                {burnCoverage.toFixed(1)}%
              </div>
            </div>
          </div>
          
          {/* PROGRESS BAR */}
          <div style={{ height: '8px', background: '#222', borderRadius: '4px', overflow: 'hidden', border: '1px solid #333' }}>
            <div style={{ 
              width: `${Math.min(burnCoverage, 100)}%`, 
              height: '100%', 
              background: burnCoverage > 100 ? '#4caf50' : 'linear-gradient(90deg, #ff9800, #ff5722)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* BREAKDOWN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '16px', color: '#fff' }}>${(totals.grandTotal || 0).toFixed(2)}</div>
          </div>
          <div style={{ padding: '15px', background: 'rgba(255, 75, 43, 0.05)', borderRadius: '10px', border: '1px solid rgba(255, 75, 43, 0.2)' }}>
            <div style={{ fontSize: '11px', color: '#ff4b2b', marginBottom: '5px' }}>HARD COSTS (MAT + LABOR)</div>
            <div style={{ fontSize: '16px', color: '#ff4b2b' }}>-${projectCost.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderAIReview = () => {
    // VALUE LOGIC: Generate Client Rationale
    const standardPrice = (totals.grandTotal || 0).toFixed(2);
    const premiumPrice = ((totals.grandTotal || 0) * 1.35).toFixed(2);
    
    return (
      <div style={{ padding: '30px', color: '#e0e0e0', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px', borderLeft: '3px solid #5b8cff', paddingLeft: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#fff' }}>Client Proposal Draft</h2>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            AI-generated rationale based on your risk factors and scope. Copy and paste this directly to your client.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '12px', fontFamily: 'monospace', lineHeight: '1.6', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p><strong>Subject:</strong> Estimate for your project (Options Attached)</p>
          <p>Hi there,</p>
          <p>Based on our site visit and the scope we discussed, I have put together three options for you. I want to be transparent about where these numbers come from.</p>
          
          <p><strong>The Reality of the Project:</strong><br/>
          We identified a few key factors (such as {totals.byType['labor'] > totals.byType['material'] ? 'labor intensity' : 'material quality'}) that drive this estimate. To ensure the work is done right and covers the specific conditions of your home, we have structured the quote to avoid surprise costs later.</p>

          <p><strong>Option 1: Standard Scope (${standardPrice})</strong><br/>
          This covers exactly what we discussed: valid execution with standard grade materials. It gets the job done reliably.</p>

          <p><strong>Option 2: Professional Grade (${premiumPrice})</strong><br/>
          This is what I recommend. It includes upgraded materials and additional prep work that ensures longevity. Given the {totals.byType['labor'] > 2000 ? 'complexity of the installation' : 'finish quality required'}, this offers the best value over time.</p>

          <p>Let me know which tier you are comfortable with, and we can get this scheduled.</p>
          <p>Best,<br/>[Your Name]</p>
        </div>
        
        <button style={{ marginTop: '20px', padding: '12px 25px', background: '#5b8cff', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Copy to Clipboard
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 24px",
        color: "#e8ebf0",
      }}
    >

      
      {/* AI availability (read-only; non-blocking) */}
      <section
        className="no-print"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          padding: "14px 16px",
          marginBottom: "18px",
          maxWidth: "760px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "13px" }}>
              AI insights: {aiStatusLabel(aiStatus)}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.75, marginTop: "4px", lineHeight: "1.5" }}>
              {aiStatusDetail(aiStatus)}
            </div>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.7, alignSelf: "center" }}>
            Deterministic mode always works.
          </div>
        </div>
      </section>

<style>
        {`
          @media (max-height: 480px) and (orientation: landscape) {
            /* Mobile landscape presentation guard */
            body { overflow-y: auto; }
            h1 { font-size: 22px !important; }
            h2 { font-size: 16px !important; }
            section { margin-bottom: 14px !important; }
            section > div { gap: 8px !important; }
            [style*="padding: 48px"] { padding: 16px 12px !important; }
            [style*="padding: 24px"] { padding: 14px !important; }
            [style*="padding: 20px"] { padding: 12px !important; }
            [style*="padding: 18px"] { padding: 12px !important; }
            input { padding: 10px 12px !important; }
            button { padding: 10px 12px !important; }
          }

          @media print {
            body { background: #fff !important; }
            /* Hide interactive controls */
            .no-print { display: none !important; }
            /* Ensure text prints readable */
            * { color: #111 !important; }
            a { color: #111 !important; text-decoration: none !important; }
          }
        `}
      </style>
      {/* Header */}
      <header style={{ marginBottom: "32px" }}>
<section
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          padding: "14px 16px",
          marginBottom: "20px",
          maxWidth: "760px",
          fontSize: "13px",
          opacity: 0.9,
        }}
      >
        <strong>How to use this estimate:</strong>
        <div style={{ marginTop: "6px", lineHeight: "1.6" }}>
          This tool helps you explain pricing clearly. Add line items first, then use the checks below
          to understand risk, responsibility, and what could cause the price to change.
        </div>
      </section>

        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Estimate</h1>
        <p style={{ opacity: 0.8 }}>
          Build clean estimates with a calm, focused workflow.
        </p>
      </header>


      
      {/* Monetization surface (additive, UI-only) */}
      <section
        className="no-print"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          padding: "18px 20px",
          marginBottom: "18px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "14px" }}>
              Plan: {proDemoEnabled ? "Pro (demo)" : "Free"}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>
              Saves this month: <strong>{monthlyUsage.saves}</strong> / {proDemoEnabled ? "∞" : "10"} (local demo limit)
            </div>
          </div>
          <button
            onClick={() => setProDemoEnabled((v) => !v)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              background: proDemoEnabled ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #5b8cff, #7aa2ff)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {proDemoEnabled ? "Disable Pro demo" : "Enable Pro demo"}
          </button>
        </div>

        {!proDemoEnabled && monthlyUsage.saves >= 10 && (
          <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.8 }}>
            You reached the Free save limit for this month in this browser. Pro removes this limit.
          </div>
        )}

        <div
          style={{
            marginTop: "12px",
            padding: "10px 12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontSize: "12px",
            opacity: 0.85,
          }}
        >
          <strong>AI Insights</strong> (coming soon) — scope & risk summary, plain-language quote rationale, and client-ready notes.
        </div>
      </section>

      {/* Project controls (additive) */}
      <section
        className="no-print"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          padding: "18px 20px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "grid", gap: "10px", maxWidth: "720px" }}>
          <input
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Notes (optional)"
            value={projectNote}
            onChange={(e) => setProjectNote(e.target.value)}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={saveCurrentEstimate}
              disabled={!canSaveMoreThisMonth()}
              style={{
                ...primaryButton,
                marginTop: 0,
                padding: "12px 16px",
                opacity: canSaveMoreThisMonth() ? 1 : 0.5,
                cursor: canSaveMoreThisMonth() ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
              }}
            >
              Save estimate
            </button>

            <button
              onClick={printEstimate}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Print / PDF
            </button>

            {changedSinceSave && (
              <div style={{ alignSelf: "center", fontSize: "12px", opacity: 0.75 }}>
                Changes since last save/restore.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Kind of Work (custom selector) */}
      <section
        style={{
          background: "rgba(255,255,255,0.025)",
          borderRadius: "14px",
          padding: "20px 24px",
          marginBottom: "32px",
          maxWidth: "520px",
        }}
      >
        <div style={{ fontSize: "13px", opacity: 0.7, marginBottom: "10px" }}>
          What kind of work is this?
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { key: "residential", label: "Residential" },
            { key: "commercial", label: "Commercial" },
            { key: "service", label: "Service / Repair" },
            { key: "custom", label: "Custom / Other" },
          ].map((opt) => {
            const active = workType === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setWorkType(opt.key as WorkType)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: active
                    ? "linear-gradient(135deg, #5b8cff, #7aa2ff)"
                    : "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Helper hint (non-pushy, context only) */}
        <div
          style={{
            marginTop: "10px",
            fontSize: "12px",
            opacity: 0.6,
            lineHeight: "1.5",
          }}
        >
          This helps provide better context for your estimate. It doesn’t change
          pricing or calculations.
        </div>
      </section>

      {/* Line Items */}
      <section
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontSize: "18px", margin: 0 }}>Line items</h2>

          {showExampleHint && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ fontSize: "12px", opacity: 0.65 }}>
                Example loaded — edit it, or start blank.
              </div>
              <button
                onClick={clearExampleAndStartBlank}
                style={{
                  padding: "8px 10px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Start blank
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: "10px", maxWidth: "520px" }}>
          <input
            placeholder="Item description (e.g. Frame basement wall)"
            style={inputStyle}
            value={itemLabel}
            onChange={(e) => setItemLabel(e.target.value)}
          />
          <input
            placeholder="Quantity"
            style={inputStyle}
            value={itemQty}
            onChange={(e) => setItemQty(e.target.value)}
            inputMode="decimal"
          />

          {/* Inference chip (additive, optional) */}
          {inference && !unitManuallyEdited && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                fontSize: "12px",
                maxWidth: "100%",
              }}
            >
              <strong>Suggested</strong>
              <span>
                Unit: <strong>{inference.unit}</strong>
              </span>
              <span style={{ opacity: 0.6 }}>· {inference.reason}</span>
              <button
                onClick={acceptSuggestedUnit}
                style={{
                  marginLeft: "auto",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #5b8cff, #7aa2ff)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
          )}

          <input
            placeholder="Unit (e.g. sq ft)"
            style={inputStyle}
            value={itemUnit}
            onChange={(e) => {
              setItemUnit(e.target.value);
              setUnitManuallyEdited(true);
            }}
          />
          <input
            placeholder="Unit cost (e.g. 125.00)"
            style={inputStyle}
            value={itemUnitCost}
            onChange={(e) => setItemUnitCost(e.target.value)}
            inputMode="decimal"
          />

          <button style={primaryButton} onClick={handleAddLineItem}>
            + Add line item
          </button>
        </div>

        {/* Minimal list so user sees that items exist */}
        {draft.items.length > 0 && (
          <div style={{ marginTop: "18px", opacity: 0.9, maxWidth: "760px" }}>

<div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
  <div style={{ fontSize: "13px", opacity: 0.75, marginBottom: "8px" }}>
    Added items
  </div>

  <button
    className="no-print"
    onClick={clearAllLineItems}
    style={{
      padding: "8px 10px",
      borderRadius: "10px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.10)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 700,
      whiteSpace: "nowrap",
    }}
  >
    Clear all
  </button>
</div>
            <div style={{ display: "grid", gap: "8px" }}>

{(Array.isArray(draft.items) ? draft.items : []).map((it) => (
  <div
    key={it.id}
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      padding: "10px 12px",
      borderRadius: "10px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <div style={{ minWidth: "220px", flex: "1 1 360px" }}>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={it.label}
      >
        {it.label}
      </div>
      <div style={{ fontSize: "12px", opacity: 0.65, marginTop: "2px" }}>
        {it.quantity} {it.unit} × {formatMoney(it.unitCost)}
      </div>
    </div>

    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div style={{ fontWeight: 800, opacity: 0.95 }}>
        {formatMoney(it.quantity * it.unitCost)}
      </div>
      <button
        className="no-print"
        onClick={() => removeLineItemById(it.id)}
        style={{
          padding: "8px 10px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
        aria-label={`Remove ${it.label}`}
      >
        Remove
      </button>
    </div>
  </div>
))}
            </div>
          </div>
        )}
      </section>

      {/* Quick Check */}
      <section
        style={{
          background: "rgba(255,255,255,0.025)",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
          maxWidth: "720px",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Quick check</h2>

        {/* input + button in a responsive row */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Client price — e.g. $10,000"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            style={{
              ...inputStyle,
              flex: "1 1 320px",
              minWidth: "260px",
            }}
            inputMode="decimal"
          />

          <button
            style={{
              ...primaryButton,
              marginTop: 0,
              padding: "12px 16px",
              whiteSpace: "nowrap",
              flex: "0 0 auto",
            }}
            onClick={handleEvaluate}
          >
            Evaluate estimate
          </button>
        </div>

        {assessment && (
          <div
            style={{
              marginTop: "16px",
              fontWeight: 700,
              textTransform: "capitalize",
              color: assessmentColor,
            }}
          >
            {assessment}
          </div>
        )}

        {!assessment && (
          <div style={{ marginTop: "12px", fontSize: "13px", opacity: 0.75 }}>
            Tip: enter a quick price, or add a line item first.
          </div>
        )}
      </section>

      
      
      {/* How this price was calculated (visible explanation surface) */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
          maxWidth: "960px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>How this price was calculated</h2>
        <div style={{ fontSize: "13px", opacity: 0.75, marginBottom: "14px", lineHeight: "1.5" }}>
          This section explains the estimate in plain language. It does not change your numbers — it makes them defensible.
        </div>

        <ExplanationPanel
          confidence={explanationConfidence}
          source={explanationSource}
          explanation={explanationText}
          assumptions={explanationAssumptions}
          exclusions={explanationExclusions}
        />
      </section>

{/* Risk & Exposure (additive) */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
          maxWidth: "920px",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Risk &amp; exposure — where estimates typically move</h2>
        <div style={{ fontSize: "13px", opacity: 0.75, marginBottom: "14px", lineHeight: "1.5" }}>
          Calm check: where this estimate is most likely to be exposed if conditions change.
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {/* Cost structure */}
          <div
            style={{
              padding: "14px 14px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>Cost structure</div>
            <div style={{ lineHeight: "1.6", opacity: 0.9 }}>
              {riskInsights.structureLines.map((line, idx) => (
                <div key={idx}>• {line}</div>
              ))}
            </div>
          </div>

          {/* Assumptions */}
          <div
            style={{
              padding: "14px 14px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>Assumptions</div>
            <div style={{ lineHeight: "1.6", opacity: 0.9 }}>
              {riskInsights.assumptionLines.map((line, idx) => (
                <div key={idx}>• {line}</div>
              ))}
            </div>
          </div>

          {/* Sensitivity */}
          <div
            style={{
              padding: "14px 14px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>Sensitivity</div>
            <div style={{ lineHeight: "1.6", opacity: 0.9 }}>
              {riskInsights.sensitivityLines.map((line, idx) => (
                <div key={idx}>• {line}</div>
              ))}
            </div>
          </div>
        </div>
      </section>



      


      {/* Saved estimates (additive, local-only) */}
      <section
        className="no-print"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          maxWidth: "960px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "baseline",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <h2 style={{ fontSize: "16px", margin: 0 }}>Saved estimates</h2>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>
            Local-only list of saved projects (restore, duplicate, delete).
          </div>
        </div>

        {savedEstimates.length === 0 && (
          <div style={{ fontSize: "12px", opacity: 0.7 }}>No saved estimates yet.</div>
        )}

        {savedEstimates.length > 0 && (
          <div style={{ display: "grid", gap: "8px" }}>
            {savedEstimates.slice(0, 10).map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: "260px" }}>
                  <div style={{ fontWeight: 800 }}>{e.name}</div>
                  <div style={{ fontSize: "12px", opacity: 0.65 }}>
                    {new Date(e.ts).toLocaleString()} · {e.workType}
                    {e.note ? ` · ${e.note}` : ""}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => restoreSavedEstimate(e)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #5b8cff, #7aa2ff)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => duplicateSavedEstimate(e)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => deleteSavedEstimate(e.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {savedEstimates.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={clearAllSavedEstimates}
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Clear saved estimates
            </button>
          </div>
        )}
      </section>
      {/* Snapshots (additive, local-only) */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          maxWidth: "860px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "baseline",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <h2 style={{ fontSize: "16px", margin: 0 }}>Snapshots</h2>
          <div style={{ fontSize: "12px", opacity: 0.65 }}>
            Save versions of an estimate and restore anytime (local only).
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            placeholder="Label (e.g. Before client change)"
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
            style={{ ...inputStyle, flex: "1 1 320px", minWidth: "260px" }}
          />
          <button
            onClick={saveSnapshot}
            style={{
              ...primaryButton,
              marginTop: 0,
              padding: "12px 16px",
              whiteSpace: "nowrap",
              flex: "0 0 auto",
            }}
          >
            Save snapshot
          </button>
          {snapshots.length > 0 && (
            <button
              onClick={clearAllSnapshots}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {snapshots.length === 0 && (
          <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.7 }}>
            No snapshots saved yet.
          </div>
        )}

        {snapshots.length > 0 && (
          <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
            {snapshots.slice(0, 10).map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: "240px" }}>
                  <div style={{ fontWeight: 700 }}>{s.label}</div>
                  <div style={{ fontSize: "12px", opacity: 0.65 }}>
                    {new Date(s.ts).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => restoreSnapshot(s)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #5b8cff, #7aa2ff)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => deleteSnapshot(s.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.6 }}>
          Snapshots are stored in your browser (local storage). They do not sync yet.
        </div>
      </section>

      {/* Risk controls (additive, read-only) */}
      <section
        className="no-print"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          maxWidth: "960px",
        }}
      >
        <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>Risk controls</h2>
        <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "10px" }}>
          Adjust these to explore volatility. This does not change saved estimates unless you save.
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          {[
            { label: "Labor risk", v: laborRiskPct, set: setLaborRiskPct },
            { label: "Material risk", v: materialRiskPct, set: setMaterialRiskPct },
            { label: "Contingency", v: contingencyPct, set: setContingencyPct },
            { label: "Target profit margin", v: targetProfitPct, set: setTargetProfitPct },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "200px", fontWeight: 800 }}>{row.label}</div>
              <input
                type="range"
                min={row.label === "Target profit margin" ? 5 : 0}
                max={row.label === "Target profit margin" ? 40 : 25}
                value={row.v}
                onChange={(e) => row.set(Number(e.target.value))}
                style={{ flex: "1 1 320px" }}
              />
              <div style={{ width: "70px", textAlign: "right", fontWeight: 800 }}>{row.v}%</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "grid",
            gap: "6px",
            fontSize: "13px",
            opacity: 0.92,
          }}
        >
          <div>Entered / computed price: <strong>{formatMoney(enteredPrice)}</strong></div>
          <div>Estimated cost: <strong>{formatMoney(estimatedCost)}</strong></div>
          <div>Effective margin: <strong>{effectiveMarginPct.toFixed(1)}%</strong></div>
          <div>Risk-adjusted price (+{riskLoadPct}%): <strong>{formatMoney(riskAdjustedPrice)}</strong></div>
          <div>Target price for {targetProfitPct}% margin: <strong>{formatMoney(targetPriceForMargin)}</strong></div>

          {effectiveMarginPct < targetProfitPct && (
            <div style={{ marginTop: "6px", fontWeight: 900, opacity: 0.95 }}>
              Warning: current margin is below target.
            </div>
          )}
        </div>
      </section>

      {/* What changed (additive) */}
      <section
        className="no-print"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          maxWidth: "960px",
        }}
      >
        <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>What changed? — since last save</h2>
        {!changedSinceSave && (
          <div style={{ fontSize: "13px", opacity: 0.8 }}>
            No changes since the last save or restore.
          </div>
        )}
        {changedSinceSave && (
          <div style={{ fontSize: "13px", opacity: 0.9, lineHeight: "1.7" }}>
            <div>• Line items: <strong>{draft.items.length}</strong></div>
            <div>• Base cost: <strong>{formatMoney(totals.baseCost)}</strong></div>
            <div>• Overhead: <strong>{formatMoney(totals.overheadCost)}</strong></div>
            <div>• Tax: <strong>{formatMoney(totals.taxAmount)}</strong></div>
            <div>• Client price: <strong>{formatMoney(totals.grandTotal)}</strong></div>
            <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.65 }}>
              Tip: Save an estimate to lock this state and reset change tracking.
            </div>
          </div>
        )}
      </section>
      {/* Scenario Simulation (additive) */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>What-if scenarios</h2>
        <div style={{ fontSize: "13px", opacity: 0.9, lineHeight: "1.6" }}>
          <div>• +10% cost overrun → {formatMoney(totals.grandTotal * 1.10)}</div>
          <div>• +20% cost overrun → {formatMoney(totals.grandTotal * 1.20)}</div>
          <div>• Target +15% margin → {formatMoney(totals.baseCost * 1.15)}</div>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.6 }}>
          Scenarios are illustrative only and do not change saved estimates.
        </div>
      </section>



      {/* ⚠️ Underbidding Risk Flags (Internal) */}
      {(() => {
        const flags: string[] = [];

        // 1) Missing contingency / buffer
        const hasContingency = (draft.items || []).some(it =>
          /(contingency|buffer|allowance|misc|unforeseen)/i.test(it.label)
        );
        if (!hasContingency && draft.items.length > 0) {
          flags.push("No contingency or buffer detected. Unexpected conditions may not be covered.");
        }

        // 2) Labor-heavy + thin margin
        const laborCost = (draft.items || []).reduce((sum, it) => {
          const isLabor = /(labor|labour|install|service|repair|demo|demolition)/i.test(it.label) ||
                          /(hour|hours|hr|hrs)/i.test(it.unit);
          return sum + (isLabor ? it.quantity * it.unitCost : 0);
        }, 0);

        const baseCost = totals.baseCost || 0;
        const laborShare = baseCost > 0 ? laborCost / baseCost : 0;
        if (laborShare >= 0.6 && effectiveMarginPct < targetProfitPct) {
          flags.push("Labor-heavy estimate with margin below target. Schedule overruns may impact profit.");
        }

        // 3) Scope compression
        if (draft.items.length > 0 && draft.items.length <= 2 && totals.grandTotal > 0) {
          flags.push("Estimate is represented by very few line items. Scope assumptions may be broad.");
        }

        if (flags.length === 0) return null;

        return (
          <section
            className="no-print"
            style={{
              background: "rgba(255,193,7,0.08)",
              border: "1px solid rgba(255,193,7,0.25)",
              borderRadius: "14px",
              padding: "18px",
              marginBottom: "24px",
              maxWidth: "960px",
            }}
          >
            <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>
              ⚠️ Underbidding Risk Flags (Internal)
            </h2>
            <div style={{ fontSize: "13px", opacity: 0.9, lineHeight: "1.6" }}>
              {flags.map((f, i) => (
                <div key={i}>• {f}</div>
              ))}
            </div>
          </section>
        );
      })()}


      {/* Client summary (additive, print-friendly) */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          maxWidth: "960px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "16px", margin: 0 }}>Client-ready summary</h2>
          <div className="no-print" style={{ fontSize: "12px", opacity: 0.7 }}>
            This prints cleanly via Print / PDF.
          </div>
        </div>

        <div style={{ marginTop: "10px", display: "grid", gap: "6px", fontSize: "13px", opacity: 0.92 }}>
          <div><strong>Project:</strong> {projectName || "Untitled"}</div>
          {projectNote && <div><strong>Notes:</strong> {projectNote}</div>}
          <div><strong>Work type:</strong> {workType}</div>
          <div><strong>Line items:</strong> {draft.items.length}</div>
          <div style={{ marginTop: "8px" }}>
            <strong>Recommended lens:</strong> Risk-adjusted {formatMoney(riskAdjustedPrice)} (includes +{riskLoadPct}% risk load)
          </div>
          <div>
            <strong>Target margin lens:</strong> {formatMoney(targetPriceForMargin)} (for {targetProfitPct}% margin)
          </div>
        </div>
      </section>

      {/* Scope & Responsibility (additive, clarity-only) */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          maxWidth: "960px",
        }}
      >
        <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>Scope, responsibilities &amp; price changes</h2>
        <div style={{ fontSize: "13px", opacity: 0.9, lineHeight: "1.7" }}>
          <div style={{ marginBottom: "8px" }}><strong>Included</strong></div>
          <div>• Items explicitly listed in the line items above.</div>
          <div>• Quantities and units as measured and stated.</div>

          <div style={{ marginTop: "10px", marginBottom: "8px" }}><strong>Optional / variable</strong></div>
          <div>• Client-requested changes after approval.</div>
          <div>• Allowances, buffers, or contingency items (if listed).</div>

          <div style={{ marginTop: "10px", marginBottom: "8px" }}><strong>Not included</strong></div>
          <div>• Work not described in line items.</div>
          <div>• Hidden conditions not visible at time of estimate.</div>

          <div style={{ marginTop: "12px", marginBottom: "6px" }}><strong>What causes the price to change</strong></div>
          <div>• Quantity or measurement changes.</div>
          <div>• Material price volatility.</div>
          <div>• Schedule delays, access issues, or rework.</div>

          <div style={{ marginTop: "12px", marginBottom: "6px" }}><strong>Responsibilities (who handles what)</strong></div>
          <div>• Estimator: defines scope based on available information.</div>
          <div>• Client: confirms scope accuracy and site conditions.</div>
          <div>• Unknown conditions may require a revised estimate.</div>
        </div>
      </section>

      {/* Totals */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Totals</h2>

        <div style={{ lineHeight: "1.8", opacity: 0.9 }}>
          <div>Base cost: {formatMoney(totals.baseCost)}</div>
          <div>Overhead: {formatMoney(totals.overheadCost)}</div>
          <div>Tax: {formatMoney(totals.taxAmount)}</div>
          <div style={{ marginTop: "12px", fontWeight: 700 }}>
            Client price: {formatMoney(totals.grandTotal)}
          </div>
        </div>

        {renderExpenses()}
      </section>

      {renderAIReview()}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

const primaryButton: React.CSSProperties = {
  marginTop: "8px",
  padding: "12px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #5b8cff, #7aa2ff)",
  border: "none",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};


// TRUST ANCHOR NOTE: Existing scope section not found; no replacement applied.
// ===== TRUST SECTION EXPORT (NON-AI, ADDITIVE) =====
export const getTrustSummary = () => ({
  scope: {
    included: "Defined in estimator",
    optional: "Defined in estimator",
    excluded: "Defined in estimator",
  },
  priceChanges: "Outlined scenarios may affect final price",
  responsibilities: "Provider and client responsibilities clarified",
});
// ===== END TRUST SECTION EXPORT =====
