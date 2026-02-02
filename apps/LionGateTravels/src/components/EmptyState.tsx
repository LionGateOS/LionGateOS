
import React from "react";
export const EmptyState: React.FC<{title:string; onCreate:()=>void;}> = ({title,onCreate}) => (
  <div className="to-empty">
    <div className="to-empty-title">{title}</div>
    <button className="to-primary-btn" onClick={onCreate}>New</button>
  </div>
);
