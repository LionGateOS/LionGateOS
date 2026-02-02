// traveler.profile.autofill.performance.summary.js
// v81 - Test Mode scenario performance summary panel
// Aggregates performance and anomaly logs into a console summary
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';

export function renderPerformanceSummary() {
  const timingLog = 'I:\\LionGateTravels\\test_mode_autofill_timing.json';
  const anomalyLog = 'I:\\LionGateTravels\\test_mode_autofill_anomalies.json';

  let timingData = [];
  let anomalies = [];

  if (fs.existsSync(timingLog)) {
    timingData = JSON.parse(fs.readFileSync(timingLog, 'utf-8'));
  }

  if (fs.existsSync(anomalyLog)) {
    anomalies = JSON.parse(fs.readFileSync(anomalyLog, 'utf-8'));
  }

  console.log('--- Test Mode Scenario Performance Summary ---');
  console.log('Performance Data:');
  console.table(timingData.map(d => ({scenario: d.scenario, consent: d.consent, duration: d.duration})));
  console.log('Detected Anomalies:');
  console.table(anomalies.map(a => ({scenario: a.scenario, consent: a.consent, error: a.error || 'Output missing'})));

  return {timingData, anomalies};
}
