// notification.wire.js
// v42 - Wire notification stub into action execution (TEST MODE)

import { executeAction } from './action.result.wire.js';
import { notify } from './notification.stub.js';

export function executeActionWithNotify(action, choice, ref, vendor) {
  const result = executeAction(action, choice, ref, vendor);
  if (result && result.ok) {
    notify('action', { action, ref, vendor });
  }
  return result;
}
