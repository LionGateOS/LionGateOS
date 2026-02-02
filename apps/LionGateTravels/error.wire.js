// error.wire.js
// v43 - Wire error handler into execution flow (TEST MODE)

import { executeActionWithNotify } from './notification.wire.js';
import { handleError } from './error.handler.js';

export function executeSafely(action, choice, ref, vendor) {
  try {
    return executeActionWithNotify(action, choice, ref, vendor);
  } catch (err) {
    return handleError(err, { action, ref, vendor });
  }
}
