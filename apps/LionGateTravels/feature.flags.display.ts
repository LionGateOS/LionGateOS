// feature.flags.display.js
// v70 - Visible Test Mode component to display active feature flags
// Shows DigitalID, Camera OCR, Auto-Fill status
// TEST MODE ONLY, no real bookings affected

import { FEATURE_FLAGS } from './feature.flags';

interface FeatureFlags {
  DIGITAL_ID: boolean;
  CAMERA_OCR: boolean;
  AUTO_FILL: boolean;
}

export function renderFeatureFlagsDisplay(): FeatureFlags {
  console.log('--- Test Mode Feature Flags ---');
  console.log('DigitalID:', FEATURE_FLAGS.DIGITAL_ID ? 'Enabled' : 'Disabled');
  console.log('Camera OCR:', FEATURE_FLAGS.CAMERA_OCR ? 'Enabled' : 'Disabled');
  console.log('Auto-Fill:', FEATURE_FLAGS.AUTO_FILL ? 'Enabled' : 'Disabled');
  return { ...FEATURE_FLAGS };
}
