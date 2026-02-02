// admin.feature.flags.audit.js
// v61 - Audit logging for feature flag changes (TEST MODE)

import { writeAudit } from './audit.writer.js';

export function auditFeatureFlagChange(flag, value) {
  writeAudit({
    type: 'feature_flag_change',
    flag,
    value,
    timestamp: new Date().toISOString()
  });
}
