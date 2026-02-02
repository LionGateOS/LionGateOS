// traveler.profile.autofill.performance.logger.js
// v79 - Test Mode performance timing logger for Auto-Fill scenarios
// Measures execution time of each scenario with consent and feature flags
// Logs to console and JSON file
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';
import { renderCombinedDashboard } from './traveler.profile.autofill.combined.dashboard.js';

const logFile = 'I:\\LionGateTravels\\test_mode_autofill_timing.json';

export function runPerformanceLogger(scenarios=['digitalid','cameraocr','combined','invalid'], consent=true) {
  const results = [];
  console.log('--- Test Mode Auto-Fill Performance Logger ---');
  for (const scenario of scenarios) {
    const start = Date.now();
    const output = renderCombinedDashboard(scenario, consent);
    const duration = Date.now() - start;
    console.log('Scenario:', scenario, 'Consent:', consent, 'Duration(ms):', duration);
    results.push({ scenario, consent, duration, output });
  }
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log('Performance log saved to', logFile);
  return results;
}
