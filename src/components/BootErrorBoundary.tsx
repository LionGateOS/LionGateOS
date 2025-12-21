import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
  stack?: string;
};

export default class BootErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const msg = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    const stack = error instanceof Error ? error.stack ?? "" : "";
    return { hasError: true, message: msg, stack };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Keep this for console diagnostics as well.
    // eslint-disable-next-line no-console
    console.error("LionGateOS BootErrorBoundary caught:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b1622",
          color: "rgba(255,255,255,0.92)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          padding: 16,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
          LionGateOS — Boot Error (Safe Mode)
        </div>
        <div style={{ opacity: 0.88, marginBottom: 12 }}>
          The UI crashed during initial render. Copy the details below and send them here.
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Error</div>
          <div>{this.state.message}</div>
          {this.state.stack ? (
            <>
              <div style={{ fontWeight: 700, margin: "12px 0 8px 0" }}>Stack</div>
              <div style={{ opacity: 0.9 }}>{this.state.stack}</div>
            </>
          ) : null}
        </div>
      </div>
    );
  }
}
