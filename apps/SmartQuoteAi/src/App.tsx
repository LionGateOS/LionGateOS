import React from "react";
import { BrowserRouter, NavLink } from "react-router-dom";
import SparklesLayer from "./system/SparklesLayer";
import AppRoutes from "./AppRoutes";

function TopNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "sq-topnav-link" + (isActive ? " is-active" : "");

  return (
    <header className="sq-topnav">
      <div className="sq-topnav-inner">
        <div className="sq-brand">
          <div className="sq-brand-dot" aria-hidden="true" />
          <div className="sq-brand-text">
            <div className="sq-brand-title">SmartQuoteAI</div>
            <div className="sq-brand-sub">Estimator</div>
          </div>
        </div>

        <nav className="sq-topnav-links" aria-label="Primary">
          <NavLink to="/estimator" className={linkClass}>
            Estimator
          </NavLink>
          <NavLink to="/business-profile" className={linkClass}>
            Business Profile
          </NavLink>
          <NavLink to="/expenses" className={linkClass}>
            Expenses
          </NavLink>
          <NavLink to="/ai-review" className={linkClass}>
            AI Review
          </NavLink>
        </nav>

        <div className="sq-topnav-right">
          <button className="sq-pill" type="button" aria-label="Plans (coming soon)">
            Plan: Starter
          </button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Background layers */}
      <div className="sq-bg" aria-hidden="true" />
      <SparklesLayer />

      {/* App chrome */}
      <TopNav />

      <main className="sq-main">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}
