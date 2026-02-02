// digitalid.providers.stub.js
// v49 - Provider registry (TEST MODE)
// This is where we add wallet/issuer specific adapters later.

export const DIGITAL_ID_PROVIDERS = {
  w3c_vc: { name: 'W3C Verifiable Credentials', enabled: true },
  iso_mdoc_mdl: { name: 'ISO/IEC 18013-5 mDL/mdoc', enabled: true },
  unknown: { name: 'Unknown', enabled: false }
};
