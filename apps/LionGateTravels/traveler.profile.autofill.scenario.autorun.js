// traveler.profile.autofill.scenario.autorun.js
// v76 - Test Mode scenario selector with auto-run
// Runs all mock inputs sequentially with consent variations and shows combined dashboard output
// TEST MODE ONLY, no real bookings affected

import { renderCombinedDashboard } from './traveler.profile.autofill.combined.dashboard.js';

const scenarios = ['digitalid', 'cameraocr', 'combined', 'invalid'];
const consents = [true, false];

export function runAllScenarios() {
  console.log('--- Test Mode Auto-Fill Scenario Auto-Run ---');
  for (const scenario of scenarios) {
    for (const consent of consents) {
      renderCombinedDashboard(scenario, consent);
    }
  }
  console.log('All Test Mode scenarios executed.');
}
