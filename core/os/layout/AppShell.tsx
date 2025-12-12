import React from "react";
import { Sidebar } from "../navigation/Sidebar";
import { Topbar } from "../navigation/Topbar";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-shell-light-root">
      <aside className="sidebar-root-dark">
        <Sidebar />
      </aside>

      <main className="app-shell-light-surface">
        <Topbar />

        <section className="app-shell-light-content">
          {children}
        </section>
      </main>
    </div>
  );
};