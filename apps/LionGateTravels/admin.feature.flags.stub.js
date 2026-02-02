// admin.feature.flags.stub.js
// v60 - Admin feature flag toggle stub (TEST MODE)
// Central place for admin-controlled toggles (no UI yet)

import { FEATURE_FLAGS } from './feature.flags.js';

export function setFeatureFlag(flag, value) {
  if (FEATURE_FLAGS.hasOwnProperty(flag)) {
    FEATURE_FLAGS[flag] = !!value;
    return { ok: true, flag, value: FEATURE_FLAGS[flag] };
  }
  return { ok: false };
}
