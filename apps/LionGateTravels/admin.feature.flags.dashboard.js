// admin.feature.flags.dashboard.js
// v69 - Test Mode Admin Feature Flag Toggle Dashboard
// Allows toggling DigitalID, Camera OCR, Auto-Fill in Test Mode
// Updates Test Mode dashboard and consent panel responses
// TEST MODE ONLY, no real bookings affected

import { setFeatureFlagWithAudit } from './admin.feature.flags.audit.wire.js';
import { dashboardWithFlags, consentPanelWithFlags } from './traveler.profile.autofill.flags.wire.js';

export function renderAdminFeatureFlagsUI(flag, value) {
  const result = setFeatureFlagWithAudit(flag, value);
  console.log('Admin Feature Flag Updated:', result);
  return result;
}

export function testModePreview(selected) {
  console.log('--- Test Mode Preview ---');
  console.log('Dashboard:', dashboardWithFlags(selected));
  console.log('Consent Panel (granted):', consentPanelWithFlags(selected, true));
  console.log('Consent Panel (denied):', consentPanelWithFlags(selected, false));
}
