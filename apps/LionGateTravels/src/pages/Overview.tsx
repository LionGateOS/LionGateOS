import React from "react";
import type { StoreState } from "../data/store";

type Props = {
  state: StoreState;
  setState: (s: StoreState) => void;
};

type FlowMode = "intake" | "overview" | "action" | "confirm";
type ActionKind = "cancel" | "change" | "issue";

function formatMoney(n: number) {
  try {
    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } catch {
    return String(n);
  }
}

export default function Overview(_props: Props) {
  const [mode, setMode] = React.useState<FlowMode>("intake");
  const [bookingRef, setBookingRef] = React.useState<string>("");
  const [vendor, setVendor] = React.useState<string>("");

  const [status, setStatus] = React.useState<string>("Booked");
  const [price] = React.useState<number>(() => Math.floor(600 + Math.random() * 1400));
  const [action, setAction] = React.useState<ActionKind>("cancel");
  const [feedback, setFeedback] = React.useState<"Yes" | "No" | null>(null);

  const goOverview = () => {
    setFeedback(null);
    setMode("overview");
  };

  const start = () => {
    const v = vendor.trim();
    if (!v) {
      alert("Just add an airline or hotel to continue.");
      return;
    }
    setStatus("Booked");
    goOverview();
  };

  const openAction = (k: ActionKind) => {
    setAction(k);
    setMode("action");
  };

  const applyRecommended = () => {
    if (action === "cancel") setStatus("Cancelled");
    if (action === "change") setStatus("Changed");
    if (action === "issue") setStatus("Issue reported");
    setMode("confirm");
  };

  const applyAlternative = () => {
    setMode("confirm");
  };

  const reset = () => {
    setBookingRef("");
    setVendor("");
    setStatus("Booked");
    setFeedback(null);
    setMode("intake");
  };

  const actionTitle =
    action === "cancel" ? "Cancel trip" :
    action === "change" ? "Change trip" :
    "Something went wrong";

  const actionText =
    action === "cancel"
      ? "Recommended will cancel the trip in Test Mode. Alternative keeps it booked."
      : action === "change"
        ? "Recommended will mark the trip as changed in Test Mode. Alternative leaves it unchanged."
        : "Recommended will file an issue in Test Mode. Alternative takes no action.";

  return (
    <main className="to-dashboard">
      <section className="to-section">

        {/* HEADER */}
        <div className="to-card" style={{ padding: 14, borderRadius: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="to-h1" style={{ margin: 0 }}>LionGate Travels</div>
              <div className="to-muted" style={{ marginTop: 4 }}>
                Test Mode — No real bookings or payments
              </div>
            </div>
            <button className="to-ghost-btn" type="button" onClick={reset}>
              Start over
            </button>
          </div>
        </div>

        {/* MICRO-CLARITY BLOCK (LT-C2) */}
        <div className="to-card" style={{ padding: 16, borderRadius: 14, marginTop: 14 }}>
          <h2 className="to-h2" style={{ marginTop: 0 }}>How this works</h2>
          <div className="to-muted" style={{ maxWidth: 720 }}>
            LionGate Travels helps you review travel details and then continues your booking or changes
            on the airline or hotel’s website.
            <br /><br />
            We do not process payments, manage reservations, or provide booking support.
          </div>
        </div>

        {mode === "intake" && (
          <div className="to-card" style={{ padding: 16, borderRadius: 14, marginTop: 14 }}>
            <h1 className="to-h1">Tell me about your trip</h1>
            <div className="to-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, maxWidth: 520 }}>
              <div>
                <div className="to-k">Booking reference (optional)</div>
                <input
                  className="to-input"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="e.g., ABC123"
                />
              </div>
              <div>
                <div className="to-k">Airline or hotel</div>
                <input
                  className="to-input"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g., Delta / Marriott"
                />
              </div>
              <div>
                <button className="to-primary-btn" type="button" onClick={start}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === "overview" && (
          <div className="to-card" style={{ padding: 16, borderRadius: 14, marginTop: 14 }}>
            <h1 className="to-h1">Trip Overview</h1>
            <div className="to-muted" style={{ marginTop: 6 }}>
              Vendor: <strong>{vendor.trim()}</strong>
            </div>
            <div className="to-muted">
              Reference: <strong>{bookingRef.trim() || "—"}</strong>
            </div>
            <div style={{ marginTop: 10 }}>
              <span className="to-pill-slim">{status}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 10 }}>
              ${formatMoney(price)} <span className="to-pill-slim" style={{ marginLeft: 8 }}>Test price</span>
            </div>

            <h2 className="to-h2" style={{ marginTop: 18 }}>What do you need help with?</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="to-danger-btn" type="button" onClick={() => openAction("cancel")}>
                Cancel trip
              </button>
              <button className="to-secondary-btn" type="button" onClick={() => openAction("change")}>
                Change trip
              </button>
              <button className="to-secondary-btn" type="button" onClick={() => openAction("issue")}>
                Something went wrong
              </button>
            </div>
          </div>
        )}

        {mode === "action" && (
          <div className="to-card" style={{ padding: 16, borderRadius: 14, marginTop: 14 }}>
            <h1 className="to-h1">{actionTitle}</h1>
            <div className="to-muted" style={{ maxWidth: 660 }}>{actionText}</div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <button className="to-primary-btn" type="button" onClick={applyRecommended}>
                Recommended
              </button>
              <button className="to-secondary-btn" type="button" onClick={applyAlternative}>
                Alternative
              </button>
              <button className="to-ghost-btn" type="button" onClick={goOverview}>
                Back
              </button>
            </div>
          </div>
        )}

        {mode === "confirm" && (
          <div className="to-card" style={{ padding: 16, borderRadius: 14, marginTop: 14 }}>
            <h1 className="to-h1">I handled this for you.</h1>
            <div className="to-muted" style={{ marginTop: 6 }}>
              Status: <strong>{status}</strong>
            </div>
            <div className="to-muted">All systems are running normally.</div>

            <h2 className="to-h2" style={{ marginTop: 18 }}>Was this easy to do?</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="to-primary-btn" type="button" onClick={() => setFeedback("Yes")}>
                Yes
              </button>
              <button className="to-secondary-btn" type="button" onClick={() => setFeedback("No")}>
                No
              </button>
              <button className="to-ghost-btn" type="button" onClick={goOverview}>
                Back to trip
              </button>
            </div>
            {feedback && (
              <div className="to-muted" style={{ marginTop: 10 }}>
                Feedback recorded: {feedback}
              </div>
            )}
          </div>
        )}

      </section>
    </main>
  );
}
