// ai.rules.wire.js
// v37 - Wire AI rules enforcer into action handling (TEST MODE)

import { resolveAction } from './ai.rules.enforcer.js';
import { auditCancel, auditChange, auditIssue } from './audit.integration.js';

export function handleAction(action, choice, ref, vendor) {
  const outcome = resolveAction(action, choice);
  if (!outcome) return null;

  switch (action) {
    case 'cancel':
      auditCancel(ref, vendor);
      break;
    case 'change':
      auditChange(ref, vendor);
      break;
    case 'issue':
      auditIssue(ref, vendor);
      break;
    default:
      break;
  }
  return outcome;
}
