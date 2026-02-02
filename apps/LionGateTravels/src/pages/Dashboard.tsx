import React from "react";
import { StoreState } from "../data/store";
export const Dashboard: React.FC<{state:StoreState}> = ({state}) => (
  <main className="to-dashboard">
    <section className="to-section">
      <h1 className="to-h1">Today&apos;s cockpit</h1>
      <div className="to-grid">
        <article className="to-card"><div className="to-card-value">{state.trips.length}</div><div className="to-card-label">Trips</div></article>
        <article className="to-card"><div className="to-card-value">{state.quotes.length}</div><div className="to-card-label">Quotes</div></article>
        <article className="to-card"><div className="to-card-value">{state.clients.length}</div><div className="to-card-label">Clients</div></article>
        <article className="to-card"><div className="to-card-value">{state.tasks.length}</div><div className="to-card-label">Tasks</div></article>
      </div>
    </section>
  </main>
);
