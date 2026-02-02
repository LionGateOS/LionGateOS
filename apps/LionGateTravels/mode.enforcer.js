// mode.enforcer.js
// v38 - Enforce TEST/LIVE mode guard for actions
// Defaults to TEST. LIVE actions are blocked unless explicitly enabled.

import { MODE } from './mode.config.js';

export function allowAction() {
  if (MODE && MODE.CURRENT === 'LIVE') {
    return false; // hard block until explicit enablement later
  }
  return true; // TEST mode allowed
}
