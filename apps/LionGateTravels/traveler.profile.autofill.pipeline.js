// traveler.profile.autofill.pipeline.js
// v56 - Auto-fill pipeline scaffold (TEST MODE)
// Connects ID/OCR sources -> normalized traveler profile -> future form autofill.

import { buildTravelerProfile } from './traveler.profile.builder.js';

export function buildProfileForAutofill(sourceResult) {
  // sourceResult is expected to be the normalized output from:
  // - intakeDigitalIdWithConsent (future)
  // - intakeDocumentImageWithConsent (future)
  return buildTravelerProfile(sourceResult);
}
