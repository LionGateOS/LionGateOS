// feature.flags.js
// v58 - Central feature flag registry (TEST MODE)

export const FEATURE_FLAGS = {
  DIGITAL_ID: false,
  CAMERA_OCR: false,
  AUTO_FILL: false
};

export function isEnabled(flag) {
  return !!FEATURE_FLAGS[flag];
}
