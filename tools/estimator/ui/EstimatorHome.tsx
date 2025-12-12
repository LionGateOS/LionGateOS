import React, { useMemo, useState } from "react";
import { Calculator, Sparkles, Package } from "lucide-react";
import { Button } from "../../../components/Button";
import { listPresets } from "../logic/PresetsEngine";
import { buildEmptyDraft, addLineItem, type EstimateDraft } from "../logic/EstimatorEngine";

export const EstimatorHome: React.FC = () => {
  const presets = useMemo(() => listPresets(), []);
  const [draft, setDraft] = useState<EstimateDraft | null>(null);

  const handleUsePreset = (presetId: string) => {
    const base = buildEmptyDraft(presetId);
    const withSample = addLineItem(base, {
      label: "Sample line item from preset",
      quantity: 1,
      unit: "lump sum",
      unitCost: 1000
    });
    setDraft(withSample);
  };

  const total = draft
    ? draft.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
    : 0;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span className="chip chip-strong">
          <Calculator size={14} />
          Estimator Prototype Online
        </span>
        <span className="chip">
          <Sparkles size={14} />
          Presets & bundles planned
        </span>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(148,163,184,0.7)",
            padding: 10,
            background:
              "radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.99))"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Package size={16} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 550 }}>Quick Presets</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>
                Tap a preset to generate a starter estimate draft. In later
                steps this will expand into full line-item bundles and quantity
                helpers.
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {presets.map((preset) => (
              <Button key={preset.id} onClick={() => handleUsePreset(preset.id)}>
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(148,163,184,0.7)",
            padding: 10,
            background:
              "radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.99))"
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 550, marginBottom: 4 }}>
            Draft Summary (prototype)
          </div>
          {!draft && (
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Select a preset on the left to generate a starter draft. This is
              just a scaffolding step — later this panel will show full
              material, labor and waste breakdowns.
            </div>
          )}
          {draft && (
            <>
              <div style={{ fontSize: 11, opacity: 0.8 }}>
                Draft ID: <code>{draft.id}</code>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: 8,
                  fontSize: 12
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "4px 0" }}>Item</th>
                    <th style={{ textAlign: "right", padding: "4px 0" }}>Qty</th>
                    <th style={{ textAlign: "right", padding: "4px 0" }}>Unit</th>
                    <th style={{ textAlign: "right", padding: "4px 0" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: "4px 0" }}>{item.label}</td>
                      <td style={{ padding: "4px 0", textAlign: "right" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "4px 0", textAlign: "right" }}>
                        {item.unit}
                      </td>
                      <td style={{ padding: "4px 0", textAlign: "right" }}>
                        ${(item.quantity * item.unitCost).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  marginTop: 6,
                  textAlign: "right",
                  fontSize: 13,
                  fontWeight: 550
                }}
              >
                Draft total (prototype): ${total.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
