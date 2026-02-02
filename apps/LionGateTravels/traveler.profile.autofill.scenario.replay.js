// traveler.profile.autofill.scenario.replay.js
// v83 - Test Mode scenario replay player
// Replays previously logged Auto-Fill scenarios sequentially in console
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';

export function replayScenarios(logFile='I:\\LionGateTravels\\test_mode_autofill_log.json') {
  if (!fs.existsSync(logFile)) {
    console.log('No log file found. Run batch simulation first.');
    return;
  }
  const data = fs.readFileSync(logFile, 'utf-8');
  const wrappedData = `[${data.trim().replace(/,\s*$/, '')}]`;
  const entries = JSON.parse(wrappedData);

  console.log('--- Test Mode Scenario Replay ---');
  entries.forEach((entry, idx) => {
    console.log(`Scenario #${idx+1}`);
    console.log('Timestamp:', entry.timestamp);
    console.log('Selected Input:', entry.selectedInput);
    console.log('Consent Granted:', entry.consentGranted);
    console.log('Feature Flags:', entry.flags);
    console.log('Dashboard Output:', entry.dashboardResult);
    console.log('Consent Output:', entry.consentResult);
    console.log('-----------------------------------');
  });
  return entries;
}
