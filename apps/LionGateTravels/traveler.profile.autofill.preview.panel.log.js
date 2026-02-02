// traveler.profile.autofill.preview.panel.log.js
// v72 - Logging and reporting for Test Mode Auto-Fill Simulation Preview Panel
// Records mock input selection, consent, and feature flag state
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';
import { renderAutoFillPreview } from './traveler.profile.autofill.preview.panel.js';

export function renderAutoFillPreviewWithLog(selected, consentGranted=true) {
  const result = renderAutoFillPreview(selected, consentGranted);
  const logEntry = {
    timestamp: new Date().toISOString(),
    selectedInput: selected,
    consentGranted,
    flags: result.flags,
    dashboardResult: result.dashboardResult,
    consentResult: result.consentResult
  };
  fs.appendFileSync('I:\LionGateTravels\test_mode_autofill_log.json', JSON.stringify(logEntry, null, 2) + ',\n');
  return result;
}
