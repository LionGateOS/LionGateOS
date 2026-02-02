// traveler.profile.builder.js
// v55 - Build normalized traveler profile from ID/OCR inputs (TEST MODE)

export function buildTravelerProfile(input) {
  // input can come from Digital ID intake or Camera OCR intake
  return {
    ok: true,
    profile: {
      fullName: input?.fields?.fullName || null,
      documentNumber: input?.fields?.documentNumber || null,
      expirationDate: input?.fields?.expirationDate || null,
      nationality: input?.fields?.nationality || null,
      address: input?.fields?.address || null
    }
  };
}
