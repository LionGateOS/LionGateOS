// traveler.profile.autofill.preview.panel.js
// v71 - Test Mode Auto-Fill Simulation Preview Panel
// Shows normalized profile and feature flags in one view
// TEST MODE ONLY, no real bookings affected

import { dashboardWithFlags, consentPanelWithFlags } from './traveler.profile.autofill.flags.wire.js';
import { renderFeatureFlagsDisplay } from './feature.flags.display.js';

export function renderAutoFillPreview(selected, consentGranted=true) {
  const flags = renderFeatureFlagsDisplay();
  const dashboardResult = dashboardWithFlags(selected);
  const consentResult = consentPanelWithFlags(selected, consentGranted);
  console.log('--- Test Mode Auto-Fill Preview Panel ---');
  console.log('Selected Input:', selected);
  console.log('Feature Flags:', flags);
  console.log('Dashboard Output:', dashboardResult);
  console.log('Consent Output:', consentResult);
  return { flags, dashboardResult, consentResult };
}
