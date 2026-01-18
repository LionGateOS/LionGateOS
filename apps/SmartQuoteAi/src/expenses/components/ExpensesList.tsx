import React from "react";
import { Expense } from "../types/expense.types";

export const ExpensesList: React.FC<{ items: Expense[] }> = ({ items }) => {
  if (!items.length) {
    return <p style={{ opacity: 0.6 }}>No expenses recorded yet.</p>;
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Expenses</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((e) => (
          <li
            key={e.id}
            style={{
              padding: "14px 18px",
              marginBottom: 12,
              borderRadius: 14,
              background: "var(--surface-02)",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {e.amount.toFixed(2)} {e.currency}
            </div>
            <div style={{ opacity: 0.8 }}>
              {e.category} · {e.date || "No date"}
            </div>
            {e.description && (
              <div style={{ marginTop: 6, opacity: 0.7 }}>{e.description}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
