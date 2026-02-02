// traveler.profile.autofill.anomaly.logger.js
// v80 - Test Mode anomaly detection logger for Auto-Fill scenarios
// Monitors scenario outputs for unusual results or errors
// Logs anomalies to console and JSON file
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';
import { renderCombinedDashboard } from './traveler.profile.autofill.combined.dashboard.js';

const anomalyLog = 'I:\\LionGateTravels\\test_mode_autofill_anomalies.json';

export function runAnomalyLogger(scenarios=['digitalid','cameraocr','combined','invalid'], consent=true) {
  const anomalies = [];
  console.log('--- Test Mode Auto-Fill Anomaly Logger ---');
  for (const scenario of scenarios) {
    try {
      const output = renderCombinedDashboard(scenario, consent);
      if (!output.dashboardResult || !output.consentResult) {
        anomalies.push({ scenario, consent, output });
        console.log('Anomaly detected in scenario:', scenario);
      }
    } catch (err) {
      anomalies.push({ scenario, consent, error: err.message });
      console.log('Error detected in scenario:', scenario, 'Error:', err.message);
    }
  }
  fs.writeFileSync(anomalyLog, JSON.stringify(anomalies, null, 2));
  console.log('Anomaly log saved to', anomalyLog);
  return anomalies;
}
