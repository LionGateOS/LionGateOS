// digitalid.adapter.js
// v49 - Digital ID readiness scaffold (TEST MODE)
// Goal: support multiple government/industry digital ID formats via adapters.
//
// Supported targets (scaffold only):
// - W3C Verifiable Credentials (VC Data Model 2.0)
// - ISO/IEC 18013-5 mDL / mdoc
// - Document scan (passport/driver license) OCR flow (separate module later)
//
// NOTE: No real verification is performed in this scaffold.

import { DigitalIdParseResult, IdKind } from '../../types';

export function parseDigitalId(payload: string | object): DigitalIdParseResult {
  // payload is expected to be a JS object or JSON string from a wallet handoff
  try {
    const obj: object = typeof payload === 'string' ? JSON.parse(payload) : payload;
    return { ok: true, kind: detectKind(obj), raw: obj };
  } catch (e: unknown) {
    return { ok: false, error: 'invalid_payload' };
  }
}

function detectKind(obj: object): IdKind {
  // Very lightweight heuristics
  if (obj && ('@context' in obj || 'type' in obj || 'credentialSubject' in obj)) return 'w3c_vc';
  if (obj && ('docType' in obj || 'issuerSigned' in obj || 'deviceSigned' in obj)) return 'iso_mdoc_mdl';
  return 'unknown';
}
