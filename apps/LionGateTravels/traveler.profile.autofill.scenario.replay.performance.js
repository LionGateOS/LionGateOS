// traveler.profile.autofill.scenario.replay.performance.js
// v85 - Test Mode scenario replay with performance overlay
// Replays scenarios and overlays execution time, feature flags, and consent
// TEST MODE ONLY, console and JSON only

import fs from 'fs';

export function replayWithPerformance(logFile='I:\\LionGateTravels\\test_mode_autofill_log.json', timingFile='I:\\LionGateTravels\\test_mode_autofill_timing.json') {
  if (!fs.existsSync(logFile)) {
    console.log('No log file found. Run batch simulation first.');
    return;
  }
  const data = fs.readFileSync(logFile, 'utf-8');
  const wrappedData = `[${data.trim().replace(/,\s*$/, '')}]`;
  const entries = JSON.parse(wrappedData);

  let timingData = [];
  if (fs.existsSync(timingFile)) {
    timingData = JSON.parse(fs.readFileSync(timingFile, 'utf-8'));
  }

  console.log('--- Test Mode Scenario Replay with Performance Overlay ---');
  entries.forEach((entry, idx) => {
    const timingEntry = timingData.find(t => t.scenario === entry.selectedInput) || {};
    console.log(`Scenario #${idx+1}`);
    console.log('Input:', entry.selectedInput);
    console.log('Consent Granted:', entry.consentGranted);
    console.log('Feature Flags:', entry.flags);
    console.log('Dashboard Output:', entry.dashboardResult);
    console.log('Consent Output:', entry.consentResult);
    console.log('Execution Time (ms):', timingEntry.duration || 'N/A');
    console.log('-----------------------------------');
  });

  const exportFile = 'I:\\LionGateTravels\\test_mode_autofill_replay_perf.json';
  fs.writeFileSync(exportFile, JSON.stringify(entries, null, 2));
  console.log('Replay with performance JSON exported to', exportFile);
  return entries;
}
