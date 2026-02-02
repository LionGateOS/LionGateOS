// traveler.profile.autofill.combined.report.js
// v87 - Test Mode Auto-Fill Combined Report Generator
// Aggregates batch simulation, replay, performance, and anomaly logs
// TEST MODE ONLY, console and JSON outputs

import fs from 'fs';

export function generateCombinedReport() {
  const batchLog = 'I:\\LionGateTravels\\test_mode_autofill_log.json';
  const timingLog = 'I:\\LionGateTravels\\test_mode_autofill_timing.json';
  const anomalyLog = 'I:\\LionGateTravels\\test_mode_autofill_anomalies.json';

  const batchData = fs.existsSync(batchLog) ? JSON.parse('[' + fs.readFileSync(batchLog,'utf-8').trim().replace(/,\s*$/,'') + ']') : [];
  const timingData = fs.existsSync(timingLog) ? JSON.parse(fs.readFileSync(timingLog,'utf-8')) : [];
  const anomalyData = fs.existsSync(anomalyLog) ? JSON.parse(fs.readFileSync(anomalyLog,'utf-8')) : [];

  console.log('--- Test Mode Auto-Fill Combined Report ---');
  batchData.forEach((entry, idx) => {
    const timingEntry = timingData.find(t => t.scenario === entry.selectedInput) || {};
    const anomalyEntry = anomalyData.find(a => a.scenario === entry.selectedInput) || {};
    console.log(`Scenario #${idx+1}`);
    console.log('Input:', entry.selectedInput);
    console.log('Consent Granted:', entry.consentGranted);
    console.log('Feature Flags:', entry.flags);
    console.log('Dashboard Output:', entry.dashboardResult);
    console.log('Consent Output:', entry.consentResult);
    console.log('Execution Time (ms):', timingEntry.duration || 'N/A');
    if (anomalyEntry.error || !entry.dashboardResult) console.log('Anomaly Detected:', anomalyEntry.error || 'Output missing');
    console.log('-----------------------------------');
  });

  const exportFile = 'I:\\LionGateTravels\\test_mode_autofill_combined_report.json';
  fs.writeFileSync(exportFile, JSON.stringify({batchData, timingData, anomalyData}, null, 2));
  console.log('Combined report exported to', exportFile);
  return {batchData, timingData, anomalyData};
}
