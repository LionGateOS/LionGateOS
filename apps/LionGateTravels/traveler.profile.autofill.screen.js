// traveler.profile.autofill.screen.js
// v63 - Test Mode visible screen for Traveler Profile auto-fill
// Displays normalized traveler profile from DigitalID or Camera OCR inputs
// TEST MODE ONLY, no real bookings affected

import { buildProfileForAutofill } from './traveler.profile.autofill.pipeline.js';

export function renderTravelerProfileScreen(sampleInput) {
  const result = buildProfileForAutofill(sampleInput);
  return {
    ok: result.ok,
    profile: result.profile,
    message: 'Test Mode: Traveler Profile Auto-Fill Simulation'
  };
}
