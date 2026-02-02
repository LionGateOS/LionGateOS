// feature.flags.wire.js
// v59 - Gate DigitalID, Camera OCR, and Auto-fill behind feature flags (TEST MODE)

import { isEnabled } from './feature.flags.js';
import { intakeDigitalID } from './digitalid.alias.js';
import { intakeDocumentImageWithConsent } from './camera.ocr.consent.wire.js';
import { buildProfileForAutofill } from './traveler.profile.autofill.pipeline.js';

export function intakeDigitalIDIfEnabled(payload) {
  if (!isEnabled('DIGITAL_ID')) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  return intakeDigitalID(payload);
}

export function intakeCameraOCRIfEnabled(imageBlob) {
  if (!isEnabled('CAMERA_OCR')) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  return intakeDocumentImageWithConsent(imageBlob);
}

export function buildAutofillIfEnabled(sourceResult) {
  if (!isEnabled('AUTO_FILL')) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  return buildProfileForAutofill(sourceResult);
}
