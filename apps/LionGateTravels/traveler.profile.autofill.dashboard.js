// traveler.profile.autofill.dashboard.js
// v66 - Test Mode interactive dashboard for Traveler Profile Auto-Fill
// Allows selecting mock input and viewing normalized profile
// TEST MODE ONLY, no real bookings affected

import { TEST_MODE_PROFILES } from './traveler.profile.autofill.screen.mock.wire.js';

export function showAutoFillDashboard(selected) {
  const profile = TEST_MODE_PROFILES[selected] || { ok: false, message: 'Invalid selection' };
  console.log('--- Test Mode Auto-Fill Dashboard ---');
  console.log('Selected:', selected);
  console.log('Profile Output:', profile);
  return profile;
}
