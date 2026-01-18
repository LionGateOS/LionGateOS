import AppShell from "../layout/AppShell";

function ExpensesPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px", color: "#e8ebf0" }}>
        <header style={{ marginBottom: "18px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Expenses</h1>
          <p style={{ opacity: 0.8 }}>
            Shell only. Receipt capture + expense tracking returns next.
          </p>
        </header>

        <section style={{ background: "rgba(14, 18, 34, 0.78)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 20, boxShadow: "0 22px 60px rgba(0,0,0,0.55)" }}>
          <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
            Future: take a photo of a receipt, select which line items to include, and attach them to an estimate.
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default ExpensesPage;
export { ExpensesPage };
