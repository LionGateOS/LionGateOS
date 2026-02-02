// traveler.profile.autofill.batch.runner.js
// v73 - Batch runner for Test Mode Auto-Fill Preview Panel
// Runs all mock inputs with consent granted/denied and logs results
// TEST MODE ONLY, no real bookings affected

import { renderAutoFillPreviewWithLog } from './traveler.profile.autofill.preview.panel.log.js';

const mockInputs = ['digitalid', 'cameraocr', 'combined', 'invalid'];
const consents = [true, false];

export function runBatchSimulation() {
  console.log('--- Test Mode Auto-Fill Batch Simulation ---');
  for (const input of mockInputs) {
    for (const consent of consents) {
      renderAutoFillPreviewWithLog(input, consent);
    }
  }
  console.log('Batch simulation completed. Logs available in test_mode_autofill_log.json');
}
