// digitalid.intake.stub.js
// v50 - Digital ID intake stub (TEST MODE)
// Central intake point to accept wallet handoff payloads later.

import { parseDigitalId } from './digitalid.adapter.js';

export function intakeDigitalId(payload) {
  const parsed = parseDigitalId(payload);
  if (!parsed.ok) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  // TEST MODE: do not persist; just acknowledge readiness
  return { ok: true, kind: parsed.kind };
}
