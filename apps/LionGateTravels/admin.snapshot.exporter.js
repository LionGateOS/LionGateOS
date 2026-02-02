// admin.snapshot.exporter.js
// v48 - Export admin snapshot (TEST MODE)

import fs from 'fs';
import path from 'path';

export function exportSnapshot() {
  try {
    const metrics = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'admin.metrics.json'), 'utf-8'));
    const audit = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'audit.log.json'), 'utf-8'));
    return {
      timestamp: new Date().toISOString(),
      metrics,
      audit
    };
  } catch (e) {
    return null;
  }
}
