
import { useCallback } from "react";
import { publish } from "../system/MessageBus";

const STORAGE_KEY = "liongateos.security.events";

export default function SecurityCenterView() {
  const emitDemoEvent = useCallback(() => {
    const event = {
      id: `demo-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: "info",
      action: "DEMO_EVENT",
      message: "Demo security event emitted.",
    };

    // 🔒 Persist immediately (does NOT rely on any view being mounted)
    try {
      const existing = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "[]"
      );
      const next = [event, ...existing];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([event]));
    }

    // 🔔 Emit via MessageBus for live listeners
    publish({
      type: "security:event",
      source: "SecurityCenter",
      payload: event,
    });
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Security Center</h2>

      <button
        onClick={emitDemoEvent}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Emit Demo Security Event
      </button>
    </div>
  );
}
