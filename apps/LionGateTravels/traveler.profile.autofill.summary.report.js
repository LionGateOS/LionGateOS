// traveler.profile.autofill.summary.report.js
// v77 - Test Mode Summary Report Generator
// Aggregates all scenario runs into a single readable summary
// TEST MODE ONLY, no real bookings affected

import fs from 'fs';

export function generateSummaryReport() {
  const logPath = 'I:\\LionGateTravels\\test_mode_autofill_log.json';
  if (!fs.existsSync(logPath)) {
    console.log('No log file found. Run batch simulation first.');
    return;
  }
  const data = fs.readFileSync(logPath, 'utf-8');
  const wrappedData = `[${data.trim().replace(/,\s*$/, '')}]`;
  const entries = JSON.parse(wrappedData);

  const summary = entries.map((entry, idx) => ({
    scenario: idx + 1,
    input: entry.selectedInput,
    consentGranted: entry.consentGranted,
    flags: entry.flags,
    profilePreview: entry.dashboardResult
  }));

  console.log('--- Test Mode Auto-Fill Summary Report ---');
  console.table(summary);
  return summary;
}
