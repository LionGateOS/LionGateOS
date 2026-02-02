// admin.metrics.wire.js
// v47 - Wire admin metrics into execution flow (TEST MODE)

import { recordMetric } from './admin.metrics.collector.js';
import { executeWithGuards } from './abuse.guard.wire.js';

export function executeWithMetrics(action, choice, ref, vendor) {
  const result = executeWithGuards(action, choice, ref, vendor);
  if (result && result.ok) {
    recordMetric(action);
  }
  return result;
}
