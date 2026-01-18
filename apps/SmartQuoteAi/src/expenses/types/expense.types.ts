export interface Expense {
  id: string;
  date: string; // ISO date
  description: string;
  amount: number;
  currency: string;
  category: string;
  vendor?: string;
  notes?: string;
}
