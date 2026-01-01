import React, { useEffect, useMemo, useState } from "react";
import type { EstimateDraft } from "../logic/EstimatorEngine";
import {
  addLineItem,
  buildEmptyDraft,
  calculateTotals,
  evaluateEstimate,
} from "../logic/EstimatorEngine";

type Assessment = "underpriced" | "reasonable" | "risky";
type WorkType = "residential" | "commercial" | "service" | "custom";

const EXAMPLE_DISMISSED_KEY = "sqai_estimator_example_dismissed_v1";

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

export default function EstimatorHome() {
  const [draft, setDraft] = useState<EstimateDraft>(() => buildEmptyDraft());

  // Context only (no pricing impact yet)
  const [workType, setWorkType] = useState<WorkType>("residential");

  // Line item form fields
  const [itemLabel, setItemLabel] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [itemUnitCost, setItemUnitCost] = useState("");

  // Quick check
  const [quickInput, setQuickInput] = useState("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  // First-visit example state (calm, non-pushy)
  const [showExampleHint, setShowExampleHint] = useState(false);

  // Assumptions & Notes (additive, no pricing impact)
  const [assumptions, setAssumptions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const totals = useMemo(() => calculateTotals(draft), [draft]);

  useEffect(() => {
    const dismissed = safeLocalStorageGet(EXAMPLE_DISMISSED_KEY);
    if (dismissed) return;
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
  }, [draft.items.length]);

  function clearExampleAndStartBlank() {
    setDraft(buildEmptyDraft());
    setAssessment(null);
    setQuickInput("");
    setShowExampleHint(false);
    safeLocalStorageSet(EXAMPLE_DISMISSED_KEY, "1");
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
      unit: itemUnit.trim() || "unit",
      unitCost: unitCost,
      costType: "other",
    });

    setDraft(next);
    setItemLabel("");
    setItemQty("");
    setItemUnit("");
    setItemUnitCost("");
    setAssessment(null);

    safeLocalStorageSet(EXAMPLE_DISMISSED_KEY, "1");
    setShowExampleHint(false);
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

  const assessmentColor =
    assessment === "reasonable"
      ? "#7dd3a5"
      : assessment === "underpriced"
      ? "#fbbf24"
      : assessment === "risky"
      ? "#f87171"
      : "#e8ebf0";

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 24px",
        color: "#e8ebf0",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Estimate</h1>
        <p style={{ opacity: 0.8 }}>
          Build clean estimates with a calm, focused workflow.
        </p>
      </header>

      {/* Kind of Work */}
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
      {/* … unchanged content … */}

      {/* Totals */}
      <section
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
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
      </section>

      {/* Assumptions & Notes */}
      <section
        style={{
          background: "rgba(255,255,255,0.025)",
          borderRadius: "14px",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>
          Assumptions & Notes
        </h2>

        <div style={{ display: "grid", gap: "14px", maxWidth: "720px" }}>
          <textarea
            placeholder="Assumptions (e.g. access, materials, conditions)"
            value={assumptions}
            onChange={(e) => setAssumptions(e.target.value)}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
          <textarea
            placeholder="Exclusions (what is not included)"
            value={exclusions}
            onChange={(e) => setExclusions(e.target.value)}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
          <textarea
            placeholder="Internal notes (not shown to client)"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
        </div>
      </section>
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
