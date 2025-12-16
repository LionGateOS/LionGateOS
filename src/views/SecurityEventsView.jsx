import { useEffect, useState } from "react";
import { subscribe } from "../system/MessageBus";

const STORAGE_KEY = "liongateos.security.events";

export default function SecurityEventsView() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      if (message.type !== "security:event") return;
      if (!message.payload) return;

      setEvents((prev) => {
        const next = [message.payload, ...prev];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Security Events</h2>

      {events.length === 0 ? (
        <div>No security events yet.</div>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id} style={{ marginBottom: 8 }}>
              <strong>{e.severity.toUpperCase()}</strong> —{" "}
              {e.message}{" "}
              <em style={{ marginLeft: 6 }}>
                ({new Date(e.timestamp).toLocaleTimeString()})
              </em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
