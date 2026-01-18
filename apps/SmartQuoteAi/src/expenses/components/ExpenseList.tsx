import React from "react";
import { Expense } from "../types/expense.types";

export const ExpenseList: React.FC<{ items: Expense[] }> = ({ items }) => (
  <div style={{ marginTop: 44 }}>
    <h2 style={{ marginBottom: 16 }}>Expenses</h2>
    <ul>
      {items.map((e) => (
        <li key={e.id} style={{ marginBottom: 14 }}>
          {e.date} — {e.description} — {e.amount} {e.currency} ({e.category})
        </li>
      ))}
    </ul>
  </div>
);
