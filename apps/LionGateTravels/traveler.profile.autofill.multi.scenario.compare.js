// traveler.profile.autofill.multi.scenario.compare.js
// v84 - Test Mode multi-scenario comparison panel
// Compares multiple logged scenarios side by side in console and JSON
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';

export function compareScenarios(logFile='I:\\LionGateTravels\\test_mode_autofill_log.json') {
  if (!fs.existsSync(logFile)) {
    console.log('No log file found. Run batch simulation first.');
    return;
  }
  const data = fs.readFileSync(logFile, 'utf-8');
  const wrappedData = `[${data.trim().replace(/,\s*$/, '')}]`;
  const entries = JSON.parse(wrappedData);

  console.log('--- Test Mode Multi-Scenario Comparison ---');
  entries.forEach((entry, idx) => {
    console.log(`Scenario #${idx+1}`);
    console.log('Input:', entry.selectedInput);
    console.log('Consent Granted:', entry.consentGranted);
    console.log('Feature Flags:', entry.flags);
    console.log('Dashboard Output:', entry.dashboardResult);
    console.log('Consent Output:', entry.consentResult);
    console.log('-----------------------------------');
  });

  const exportFile = 'I:\\LionGateTravels\\test_mode_autofill_comparison.json';
  fs.writeFileSync(exportFile, JSON.stringify(entries, null, 2));
  console.log('Comparison JSON exported to', exportFile);
  return entries;
}
