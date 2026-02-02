import React from "react";
import { NavLink } from "react-router-dom";
const navItems = [
  { path: "/", label: "Overview" },
  { path: "/trips", label: "Trips" },
  { path: "/quotes", label: "Quotes" },
  { path: "/clients", label: "Clients" },
  { path: "/tasks", label: "Tasks" },
  { path: "/settings", label: "Settings" }
];
export const Sidebar: React.FC = () => (
  <aside className="to-sidebar">
    <div className="to-logo">TravelOrchestrator</div>
    <nav>
      {navItems.map(i => (
        <NavLink key={i.path} to={i.path} end={i.path==="/"} className={({isActive})=>"to-nav-item"+(isActive?" to-nav-item-active":"")}>{i.label}</NavLink>
      ))}
    </nav>
  </aside>
);
