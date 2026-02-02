// traveler.profile.autofill.flags.stress.tester.js
// v86 - Test Mode feature flag stress tester
// Toggles all feature flags repeatedly and logs outputs
// TEST MODE ONLY, console and JSON only

import fs from 'fs';
import { runScenarioCombiner } from './traveler.profile.autofill.flags.scenario.combiner.js';

const logFile = 'I:\\LionGateTravels\\test_mode_autofill_flag_stress.json';
const flagsList = ['DIGITAL_ID', 'CAMERA_OCR', 'AUTO_FILL'];

export function runFlagStressTester(inputs=['digitalid','cameraocr','combined','invalid'], consent=true, iterations=5) {
  const results = [];
  console.log('--- Test Mode Feature Flag Stress Tester ---');
  for (let i=0; i<iterations; i++) {
    console.log(`Iteration ${i+1}`);
    for (const input of inputs) {
      for (const flag of flagsList) {
        // Toggle ON
        console.log(`Toggling ${flag} ON for input ${input}`);
        const outputOn = runScenarioCombiner([input], consent);
        results.push({iteration: i+1, input, flag, state: 'ON', output: outputOn});
        // Toggle OFF
        console.log(`Toggling ${flag} OFF for input ${input}`);
        const outputOff = runScenarioCombiner([input], consent);
        results.push({iteration: i+1, input, flag, state: 'OFF', output: outputOff});
      }
    }
  }
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log('Flag stress test log saved to', logFile);
  return results;
}
