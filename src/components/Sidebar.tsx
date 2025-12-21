import React from "react";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="os-sidebar">
      {children}
    </aside>
  );
}
