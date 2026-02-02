// admin.metrics.collector.js
// v46 - Metrics collector scaffold (TEST MODE)

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'admin.metrics.json');

export function recordMetric(type) {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    raw.counters.actions_total += 1;
    if (raw.counters[type] !== undefined) {
      raw.counters[type] += 1;
    }
    raw.last_updated = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2));
  } catch (e) {
    // silent fail in test mode
  }
}
