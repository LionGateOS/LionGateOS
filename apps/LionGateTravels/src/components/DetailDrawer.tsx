import React from "react";

export function DetailDrawer({
  isOpen,
  title,
  onClose,
  children,
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="to-drawer-wrap" role="dialog" aria-modal="true">
      <div className="to-drawer-backdrop" onClick={onClose} />
      <aside className="to-drawer">
        <div className="to-drawer-head">
          <div className="to-drawer-title">{title}</div>
          <button className="to-ghost-btn" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="to-drawer-body">{children}</div>
      </aside>
    </div>
  );
}
