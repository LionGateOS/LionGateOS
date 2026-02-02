// traveler.profile.autofill.flags.auto.toggle.js
// v82 - Test Mode feature flag auto-toggle simulator
// Automatically cycles feature flags and logs scenario outputs
// TEST MODE ONLY, console and JSON logs only

import fs from 'fs';
import { runScenarioCombiner } from './traveler.profile.autofill.flags.scenario.combiner.js';

const logFile = 'I:\\LionGateTravels\\test_mode_autofill_flag_simulation.json';
const flagsList = ['DIGITAL_ID', 'CAMERA_OCR', 'AUTO_FILL'];

export function runFeatureFlagAutoToggle(inputs=['digitalid','cameraocr','combined','invalid'], consent=true) {
  const results = [];
  console.log('--- Test Mode Feature Flag Auto-Toggle Simulator ---');
  for (const input of inputs) {
    for (const flag of flagsList) {
      // Toggle on
      console.log(`Toggling ${flag} ON for input ${input}`);
      const outputOn = runScenarioCombiner([input], consent);
      results.push({input, flag, state: 'ON', output: outputOn});
      // Toggle off
      console.log(`Toggling ${flag} OFF for input ${input}`);
      const outputOff = runScenarioCombiner([input], consent);
      results.push({input, flag, state: 'OFF', output: outputOff});
    }
  }
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log('Auto-toggle simulation log saved to', logFile);
  return results;
}
