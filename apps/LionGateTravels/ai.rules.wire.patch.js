// ai.rules.wire.patch.js
// v38 - Patch to guard actions by mode (TEST MODE default)

import { allowAction } from './mode.enforcer.js';
import { handleAction as baseHandle } from './ai.rules.wire.js';

export function handleAction(action, choice, ref, vendor) {
  if (!allowAction()) return null;
  return baseHandle(action, choice, ref, vendor);
}
