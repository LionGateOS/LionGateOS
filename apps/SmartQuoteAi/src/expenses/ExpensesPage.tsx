import React, { useState } from "react";
import { Expense } from "./types/expense.types";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  return (
    <div style={{ padding: 36 }}>
      <h1 style={{ marginBottom: 36 }}>Expenses</h1>
      <ExpenseForm onAdd={(e) => setExpenses((prev) => [...prev, e])} />
      <ExpenseList items={expenses} />
    </div>
  );
};
