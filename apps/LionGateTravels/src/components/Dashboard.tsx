import React from "react";

const cards = [
  { label: "Active trips", value: "7" },
  { label: "Quotes awaiting reply", value: "3" },
  { label: "Tasks due today", value: "5" },
  { label: "Clients travelling now", value: "2" }
];

export const Dashboard: React.FC = () => {
  return (
    <main className="to-dashboard">
      <section className="to-section">
        <h1 className="to-h1">Today&apos;s cockpit</h1>
        <p className="to-muted">
          A single place to see what needs your attention across all travellers,
          quotes and suppliers.
        </p>
        <div className="to-grid">
          {cards.map((card) => (
            <article key={card.label} className="to-card">
              <div className="to-card-value">{card.value}</div>
              <div className="to-card-label">{card.label}</div>
            </article>
          ))}
        </div>
      </section>
      <section className="to-section">
        <h2 className="to-h2">Next actions</h2>
        <ul className="to-list">
          <li>Call supplier to confirm airport transfer times.</li>
          <li>Send updated quote for Lisbon city break.</li>
          <li>Check-in reminder for tomorrow&apos;s departures.</li>
        </ul>
      </section>
    </main>
  );
};
