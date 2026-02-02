// traveler.profile.autofill.consent.panel.js
// v67 - Test Mode Consent Simulation Panel for Traveler Profile Auto-Fill
// Simulate granting/denying consent for DigitalID/Camera OCR inputs
// TEST MODE ONLY, no real bookings affected

import { TEST_MODE_PROFILES } from './traveler.profile.autofill.screen.mock.wire.js';

export function simulateConsent(selected, consentGranted=true) {
  if (!TEST_MODE_PROFILES[selected]) {
    return { ok: false, message: 'Invalid selection' };
  }
  if (!consentGranted) {
    return { ok: false, message: 'Consent denied. Auto-Fill blocked.' };
  }
  return { ok: true, profile: TEST_MODE_PROFILES[selected].profile, message: 'Consent granted. Auto-Fill processed.' };
}
