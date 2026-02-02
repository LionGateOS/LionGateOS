import React from "react";
export const BulkBar: React.FC<{
  count: number;
  actions: React.ReactNode;
  onClear: () => void;
}> = ({ count, actions, onClear }) => (
  <div className="to-bulkbar" role="region" aria-label="Bulk actions">
    <div className="to-bulkbar-left">
      <span className="to-bulk-count">{count} selected</span>
      <button className="to-ghost-btn" onClick={onClear} type="button">Clear</button>
    </div>
    <div className="to-bulkbar-actions">{actions}</div>
  </div>
);
