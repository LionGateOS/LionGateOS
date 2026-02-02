// abuse.guard.wire.js
// v45 - Wire abuse guard into execution (TEST MODE)

import { allowAction as allowByMode } from './mode.enforcer.js';
import { allowAction as allowByAbuse } from './abuse.guard.js';
import { executeSafely } from './error.wire.js';

export function executeWithGuards(action, choice, ref, vendor) {
  if (!allowByMode()) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  if (!allowByAbuse()) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  return executeSafely(action, choice, ref, vendor);
}
