// action.result.wire.js
// v40 - Wire action result mapper into action handling (TEST MODE)

import { handleAction } from './ai.rules.wire.patch.js';
import { mapResult } from './action.result.mapper.js';

export function executeAction(action, choice, ref, vendor) {
  const outcome = handleAction(action, choice, ref, vendor);
  return mapResult(outcome);
}
