
import React, { useEffect, useState } from "react";
import { subscribe } from "../system/MessageBus";

export default function SecurityEventsView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    return subscribe((msg) => {
      if (msg.type === "os:security:permission") {
        setEvents((prev) => [msg.payload, ...prev]);
      }
    });
  }, []);

  return (
    <div className="lgos-view">
      <h2>Security Events</h2>
      <p className="lgos-text-muted">Live permission activity</p>
      <ul>
        {events.map((e, i) => (
          <li key={i}>
            <b>{e.kind.toUpperCase()}</b> — {e.appId} — {e.permission}
          </li>
        ))}
      </ul>
    </div>
  );
}
