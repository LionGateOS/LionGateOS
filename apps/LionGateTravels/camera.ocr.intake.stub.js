// camera.ocr.intake.stub.js
// v53 - Camera OCR intake scaffold (TEST MODE)
// Placeholder for passport / driver's license photo OCR.

export function intakeDocumentImage(imageBlob) {
  // TEST MODE: no OCR performed
  // Returns normalized placeholder structure
  return {
    ok: true,
    docType: 'unknown',
    fields: {
      fullName: null,
      documentNumber: null,
      expirationDate: null,
      nationality: null,
      address: null
    }
  };
}
