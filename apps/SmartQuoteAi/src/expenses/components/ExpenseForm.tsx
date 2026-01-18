import React, { useState } from "react";
import { Expense } from "../types/expense.types";
import { WheelSelect } from "./WheelSelect";

const CATEGORIES = [
  "Meals","Travel","Office","Software","Supplies",
  "Marketing","Utilities","Equipment","Professional Services","Training","Other"
];

const CURRENCIES = ["USD","CAD","EUR","GBP","AUD","JPY","MXN","BRL","INR","CHF"];

function normalizeAmount(v: string): string {
  if (!v) return "";
  const n = Number(v.replace(/,/g, ""));
  if (Number.isNaN(n)) return v;
  return n.toFixed(2);
}

export const ExpenseForm: React.FC<{ onAdd: (e: Expense) => void }> = ({ onAdd }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState("Meals");
  const [date, setDate] = useState("");

  const submit = () => {
    onAdd({
      id: crypto.randomUUID(),
      date,
      description,
      amount: Number(normalizeAmount(amount) || 0),
      currency,
      category
    });
    setDescription("");
    setAmount("");
    setDate("");
  };

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      style={{ maxWidth: 820, marginTop: 32 }}
    >
      <h2 style={{ marginBottom: 24 }}>Add Expense</h2>

      <div style={{ marginBottom: 22 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            background: "var(--surface-02)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-subtle)"
          }}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the expense"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            background: "var(--surface-02)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-subtle)",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Amount</label>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => setAmount(normalizeAmount(amount))}
          placeholder="0.00"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            background: "var(--surface-02)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-subtle)"
          }}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <WheelSelect label="Currency" value={currency} options={CURRENCIES} onChange={setCurrency} />
      </div>

      <div style={{ marginBottom: 28 }}>
        <WheelSelect label="Category" value={category} options={CATEGORIES} onChange={setCategory} />
      </div>

      <button
        type="button"
        onClick={submit}
        style={{
          padding: "14px 28px",
          borderRadius: 18,
          fontWeight: 700,
          background: "var(--surface-glass)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-elevated)",
          cursor: "pointer"
        }}
      >
        Add Expense
      </button>
    </div>
  );
};
