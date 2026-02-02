// traveler.profile.autofill.combined.dashboard.js
// v75 - Combined Test Mode Dashboard Panel
// Shows feature flags, selected input, consent, and profile preview
// TEST MODE ONLY, no real bookings affected

import { renderFeatureFlagsDisplay } from './feature.flags.display.js';
import { dashboardWithFlags, consentPanelWithFlags } from './traveler.profile.autofill.flags.wire.js';

export function renderCombinedDashboard(selected, consentGranted=true) {
  const flags = renderFeatureFlagsDisplay();
  const dashboardResult = dashboardWithFlags(selected);
  const consentResult = consentPanelWithFlags(selected, consentGranted);
  console.log('--- Test Mode Combined Dashboard ---');
  console.log('Selected Input:', selected);
  console.log('Feature Flags:', flags);
  console.log('Dashboard Output:', dashboardResult);
  console.log('Consent Output:', consentResult);
  return { flags, dashboardResult, consentResult };
}
