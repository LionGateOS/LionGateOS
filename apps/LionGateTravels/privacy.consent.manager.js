// privacy.consent.manager.js
// v51 - Privacy & Consent Manager (TEST MODE)
// Central place to record user consent for sensitive actions (e.g., Digital ID usage)

export function requireConsent(scope) {
  // TEST MODE: always return true, no persistence
  return { ok: true, scope };
}
