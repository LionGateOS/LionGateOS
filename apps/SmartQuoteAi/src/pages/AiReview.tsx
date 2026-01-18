import React, { useMemo } from "react";

import {
  assembleExplanations,
  type RowsContract,
  type ExplanationUnit,
} from "../explanations/explanationAssembler";

/**
 * Phase 3 — Data visibility ON
 * This page is still "preview-only" (no pricing changes, no writes).
 * It only renders what Phase 3 would output from a Rows-style contract.
 */
const PHASE3_DATA_VISIBILITY_ON = true;

const SAMPLE_ROWS_CONTRACT: RowsContract = {
  fields: [
    {
      domain: "scope",
      id: "scope-1",
      text: "Scope is defined by the line items entered (what is listed is included).",
      order: 1,
    },
    {
      domain: "responsibility",
      id: "resp-1",
      text: "Client confirms site conditions and access; estimator prices based on stated conditions.",
      order: 2,
    },
    {
      domain: "risk",
      id: "risk-1",
      text: "Unknown conditions (hidden damage, access issues, rework) can change cost and schedule.",
      order: 3,
    },
    {
      domain: "dependency",
      id: "dep-1",
      text: "Estimate depends on entered quantities and units; measurement changes may require revision.",
      order: 4,
    },
    {
      domain: "exclusion",
      id: "exc-1",
      text: "Work not listed is excluded unless added explicitly in writing.",
      order: 5,
    },
  ],
};

function groupByDomain(units: ExplanationUnit[]) {
  const out: Record<string, ExplanationUnit[]> = {
    scope: [],
    responsibility: [],
    risk: [],
    dependency: [],
    exclusion: [],
  };
  for (const u of units) out[u.domain].push(u);
  for (const k of Object.keys(out)) out[k].sort((a, b) => a.order - b.order);
  return out as Record<ExplanationUnit["domain"], ExplanationUnit[]>;
}

export default function AiReview() {
  const phase3 = useMemo(() => {
    if (!PHASE3_DATA_VISIBILITY_ON) {
      return { enabled: false as const, units: [] as ExplanationUnit[], grouped: groupByDomain([]) };
    }
    const assembled = assembleExplanations(SAMPLE_ROWS_CONTRACT);
    return {
      enabled: true as const,
      units: assembled.units || [],
      grouped: groupByDomain(assembled.units || []),
    };
  }, []);

  return (
    <div className="sq-page">
      <div className="sq-page-inner">
        <div className="sq-breadcrumb">SmartQuote AI</div>

        <h1 className="sq-h1">AI Review</h1>

        <div className="sq-glass sq-pad-lg" style={{ maxWidth: 920 }}>
          <div className="sq-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
            Preview-only. Advisory. Read-only.
          </div>

          <div style={{ marginTop: 10 }} className="sq-muted">
            Phase 3 data visibility is{" "}
            <strong>{phase3.enabled ? "ON" : "OFF"}</strong>. This renders the Phase 3 explanation
            output (assembled units) without changing any estimator behavior.
          </div>
        </div>

        {phase3.enabled && (
          <div style={{ marginTop: 18, maxWidth: 980 }}>
            <div className="sq-glass sq-pad-lg">
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Phase 3 output (assembled)</div>

              <div style={{ display: "grid", gap: 14 }}>
                {(
                  [
                    ["scope", "Scope"],
                    ["responsibility", "Responsibilities"],
                    ["risk", "Risk"],
                    ["dependency", "Dependencies"],
                    ["exclusion", "Exclusions"],
                  ] as const
                ).map(([key, label]) => {
                  const items = phase3.grouped[key];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={key}>
                      <div className="sq-muted" style={{ fontWeight: 800, marginBottom: 6 }}>
                        {label}
                      </div>
                      <div style={{ display: "grid", gap: 6 }}>
                        {items.map((u) => (
                          <div
                            key={u.id}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 12,
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              lineHeight: 1.6,
                            }}
                          >
                            {u.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <details style={{ marginTop: 16 }}>
                <summary style={{ cursor: "pointer", fontWeight: 800 }}>
                  Raw Phase 3 data (contract + assembled units)
                </summary>
                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <div>
                    <div className="sq-muted" style={{ fontWeight: 800, marginBottom: 6 }}>
                      Contract
                    </div>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        padding: 12,
                        borderRadius: 12,
                        background: "rgba(0,0,0,0.25)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(SAMPLE_ROWS_CONTRACT, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <div className="sq-muted" style={{ fontWeight: 800, marginBottom: 6 }}>
                      Assembled units
                    </div>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        padding: 12,
                        borderRadius: 12,
                        background: "rgba(0,0,0,0.25)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(phase3.units, null, 2)}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}

        {!phase3.enabled && (
          <div style={{ marginTop: 18, maxWidth: 920 }} className="sq-glass sq-pad-lg">
            Phase 3 data visibility is OFF. This page is a stable placeholder that confirms routing
            and UI skinning.
          </div>
        )}
      </div>
    </div>
  );
}
