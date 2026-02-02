// traveler.profile.autofill.screen.mock.wire.js
// v65 - Wire mock JSON inputs into Test Mode Traveler Profile Auto-Fill screen
// TEST MODE ONLY, no real bookings affected

import { renderTravelerProfileScreen } from './traveler.profile.autofill.screen.js';
import digitalidSample from './digitalid_sample.json';
import cameraocrSample from './cameraocr_sample.json';
import combinedSample from './combined_sample.json';
import invalidSample from './invalid_sample.json';

export const TEST_MODE_PROFILES = {
  digitalid: renderTravelerProfileScreen(digitalidSample),
  cameraocr: renderTravelerProfileScreen(cameraocrSample),
  combined: renderTravelerProfileScreen(combinedSample),
  invalid: renderTravelerProfileScreen(invalidSample)
};
