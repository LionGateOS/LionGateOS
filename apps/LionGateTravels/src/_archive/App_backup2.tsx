
import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>🚀 LionGateOS Travels — Expedia Demo Mode</h1>
      <p>
        This screen confirms that the <strong>Expedia demo App</strong> is now mounted.
      </p>

      <section style={{ marginTop: '32px' }}>
        <h2>What this means</h2>
        <ul>
          <li>✅ Your original app is untouched</li>
          <li>✅ Vite is rendering a different App file</li>
          <li>✅ This is where Expedia / Hotels / Cars / Activities UI will appear</li>
        </ul>
      </section>

      <section style={{ marginTop: '32px' }}>
        <h2>Next integrations</h2>
        <ul>
          <li>Lodging (Expedia Rapid API)</li>
          <li>Cars</li>
          <li>Activities</li>
          <li>Affiliate tracking</li>
        </ul>
      </section>

      <p style={{ marginTop: '40px', opacity: 0.7 }}>
        If you can see this page, the wiring step is complete.
      </p>
    </div>
  );
}
