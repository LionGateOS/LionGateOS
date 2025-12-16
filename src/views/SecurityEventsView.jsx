import { useEffect, useMemo, useState } from "react";
import { subscribe } from "../system/MessageBus";

const STORAGE_KEY = "liongateos.security.events";

function normalizePermissionEvent(message) {
  const e = message.payload;
  if (!e) return null;

  let severity = "info";
  if (e.kind === "denied" || e.kind === "unknown-app") {
    severity = "error";
  }

  return {
    id: `perm-${e.appId}-${e.permission}-${e.timestamp}`,
    timestamp: new Date(e.timestamp).toISOString(),
    severity,
    message:
      e.kind === "granted"
        ? `Permission granted: ${e.appId} → ${e.permission}`
        : e.kind === "denied"
        ? `Permission denied: ${e.appId} → ${e.permission}`
        : `Unknown app attempted permission: ${e.appId} → ${e.permission}`,
  };
}

function getSeverityStyle(severityRaw) {
  const severity = (severityRaw || "info").toLowerCase();

  if (severity === "error") {
    return {
      label: "ERROR",
      pill: {
        padding: "2px 8px",
        borderRadius: 999,
        fontWeight: 700,
        letterSpacing: 0.5,
        border: "1px solid rgba(255, 90, 90, 0.35)",
        background: "rgba(255, 90, 90, 0.10)",
      },
      row: {
        borderLeft: "3px solid rgba(255, 90, 90, 0.55)",
      },
    };
  }

  if (severity === "warning") {
    return {
      label: "WARN",
      pill: {
        padding: "2px 8px",
        borderRadius: 999,
        fontWeight: 700,
        letterSpacing: 0.5,
        border: "1px solid rgba(255, 200, 80, 0.35)",
        background: "rgba(255, 200, 80, 0.10)",
      },
      row: {
        borderLeft: "3px solid rgba(255, 200, 80, 0.55)",
      },
    };
  }

  return {
    label: "INFO",
    pill: {
      padding: "2px 8px",
      borderRadius: 999,
      fontWeight: 700,
      letterSpacing: 0.5,
      border: "1px solid rgba(170, 190, 255, 0.25)",
      background: "rgba(170, 190, 255, 0.08)",
    },
    row: {
      borderLeft: "3px solid rgba(170, 190, 255, 0.35)",
    },
  };
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "error", label: "Errors" },
  { key: "info", label: "Info" },
];

export default function SecurityEventsView() {
  const [filter, setFilter] = useState("all");
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
      let event = null;

      if (message.type === "security:event") {
        event = message.payload;
      }

      if (message.type === "os:security:permission") {
        event = normalizePermissionEvent(message);
      }

      if (!event) return;

      const normalized = {
        id: event.id || `evt-${Date.now()}`,
        timestamp: event.timestamp || new Date().toISOString(),
        severity: (event.severity || "info").toLowerCase(),
        message: event.message || "(no message)",
      };

      setEvents((prev) => {
        const next = [normalized, ...prev];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const visibleEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.severity === filter);
  }, [events, filter]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Security Events</h2>

      {/* Filters */}
      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              cursor: "pointer",
              border:
                filter === f.key
                  ? "1px solid rgba(170,190,255,0.45)"
                  : "1px solid rgba(255,255,255,0.15)",
              background:
                filter === f.key
                  ? "rgba(170,190,255,0.12)"
                  : "rgba(255,255,255,0.04)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visibleEvents.length === 0 ? (
        <div>No security events for this filter.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {visibleEvents.map((e) => {
            const s = getSeverityStyle(e.severity);
            return (
              <li
                key={e.id}
                style={{
                  ...s.row,
                  marginBottom: 10,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <span style={{ ...s.pill, marginRight: 10 }}>{s.label}</span>
                <span>{e.message}</span>
                <em style={{ marginLeft: 10, opacity: 0.75 }}>
                  ({new Date(e.timestamp).toLocaleTimeString()})
                </em>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
