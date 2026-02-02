// ai.rules.enforcer.js
// v36 - Enforce AI decision rules (TEST MODE)
// Central place to resolve Recommended vs Alternative outcomes.

import rules from './ai.decision.rules.json' assert { type: 'json' };

export function resolveAction(action, choice) {
  try {
    const set = rules.rules[action];
    if (!set) return null;
    return set[choice] || null;
  } catch (e) {
    return null;
  }
}
