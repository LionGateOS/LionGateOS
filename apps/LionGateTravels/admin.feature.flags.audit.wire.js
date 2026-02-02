// admin.feature.flags.audit.wire.js
// v61 - Wire audit logging into feature flag toggle (TEST MODE)

import { setFeatureFlag } from './admin.feature.flags.stub.js';
import { auditFeatureFlagChange } from './admin.feature.flags.audit.js';

export function setFeatureFlagWithAudit(flag, value) {
  const result = setFeatureFlag(flag, value);
  if (result.ok) {
    auditFeatureFlagChange(flag, result.value);
  }
  return result;
}
