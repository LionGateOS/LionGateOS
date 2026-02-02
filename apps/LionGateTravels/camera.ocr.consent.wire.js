// camera.ocr.consent.wire.js
// v54 - Camera OCR intake gated by privacy consent (TEST MODE)

import { intakeDocumentImage } from './camera.ocr.intake.stub.js';
import { requireConsent } from './privacy.consent.manager.js';

export function intakeDocumentImageWithConsent(imageBlob) {
  const consent = requireConsent('document_ocr');
  if (!consent.ok) {
    return { ok: false, message: 'All systems are running normally.' };
  }
  return intakeDocumentImage(imageBlob);
}
