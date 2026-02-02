// traveler.profile.autofill.report.js
// v74 - Generates a readable report from Test Mode Auto-Fill log
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';

export function generateAutoFillReport() {
  const logPath = 'I:\\LionGateTravels\\test_mode_autofill_log.json';
  if (!fs.existsSync(logPath)) {
    console.log('Log file not found. Run batch simulation first.');
    return;
  }
  const data = fs.readFileSync(logPath, 'utf-8');
  // Remove trailing comma/newline and wrap in array
  const wrappedData = `[${data.trim().replace(/,\s*$/, '')}]`;
  const entries = JSON.parse(wrappedData);
  console.log('--- Test Mode Auto-Fill Report ---');
  entries.forEach((entry, idx) => {
    console.log(`Scenario #${idx+1}`);
    console.log('Timestamp:', entry.timestamp);
    console.log('Input:', entry.selectedInput);
    console.log('Consent Granted:', entry.consentGranted);
    console.log('Feature Flags:', entry.flags);
    console.log('Dashboard Result:', entry.dashboardResult);
    console.log('Consent Result:', entry.consentResult);
    console.log('-----------------------------------');
  });
  return entries;
}
