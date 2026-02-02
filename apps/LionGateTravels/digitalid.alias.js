// digitalid.alias.js
// v57 - DigitalID alias layer (TEST MODE)
// Maps generic 'DigitalID' terminology to underlying standards adapters.

import { intakeDigitalIdWithConsent } from './digitalid.intake.consent.js';

export function intakeDigitalID(payload) {
  // Alias entry point for anything labeled "DigitalID"
  return intakeDigitalIdWithConsent(payload);
}
