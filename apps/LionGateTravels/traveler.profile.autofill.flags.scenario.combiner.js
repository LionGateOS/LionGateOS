// traveler.profile.autofill.flags.scenario.combiner.js
// v78 - Test Mode interactive feature flag scenario combiner
// Select multiple feature flags and mock inputs simultaneously
// TEST MODE ONLY, console output only

import { renderCombinedDashboard } from './traveler.profile.autofill.combined.dashboard.js';
import { renderFeatureFlagsDisplay } from './feature.flags.display.js';

export function runScenarioCombiner(selectedInputs, consentGranted=true) {
  const flags = renderFeatureFlagsDisplay();
  console.log('--- Test Mode Feature Flag Scenario Combiner ---');
  for (const input of selectedInputs) {
    const dashboardOutput = renderCombinedDashboard(input, consentGranted);
    console.log('Input:', input, 'Consent Granted:', consentGranted);
    console.log('Feature Flags:', flags);
    console.log('Dashboard Output:', dashboardOutput.dashboardResult);
    console.log('Consent Output:', dashboardOutput.consentResult);
    console.log('------------------------------------------');
  }
}
