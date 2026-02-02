// traveler.profile.autofill.flags.wire.js
// v68 - Wire feature flags into Test Mode Dashboard & Consent Panel
// Gates DigitalID, Camera OCR, Auto-Fill based on feature flags
// TEST MODE ONLY, no real bookings affected

import { isEnabled } from './feature.flags.js';
import { showAutoFillDashboard } from './traveler.profile.autofill.dashboard.js';
import { simulateConsent } from './traveler.profile.autofill.consent.panel.js';

export function dashboardWithFlags(selected) {
  if (selected === 'digitalid' && !isEnabled('DIGITAL_ID')) {
    return { ok: false, message: 'DigitalID feature disabled.' };
  }
  if (selected === 'cameraocr' && !isEnabled('CAMERA_OCR')) {
    return { ok: false, message: 'Camera OCR feature disabled.' };
  }
  return showAutoFillDashboard(selected);
}

export function consentPanelWithFlags(selected, consentGranted=true) {
  if (selected === 'digitalid' && !isEnabled('DIGITAL_ID')) {
    return { ok: false, message: 'DigitalID feature disabled.' };
  }
  if (selected === 'cameraocr' && !isEnabled('CAMERA_OCR')) {
    return { ok: false, message: 'Camera OCR feature disabled.' };
  }
  if (!isEnabled('AUTO_FILL')) {
    return { ok: false, message: 'Auto-Fill feature disabled.' };
  }
  return simulateConsent(selected, consentGranted);
}
