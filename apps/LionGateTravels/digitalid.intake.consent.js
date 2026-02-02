// digitalid.intake.consent.js
// v52 - Digital ID intake with consent enforcement (TEST MODE)

import { intakeDigitalId } from './digitalid.intake.stub.js';
import { requireConsent } from './privacy.consent.manager.js';

export function intakeDigitalIdWithConsent(payload) {
  const consent = requireConsent('digital_id');
  if (!consent.ok) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  return intakeDigitalId(payload);
}
