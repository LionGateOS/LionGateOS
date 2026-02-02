LionGate Travels — Digital ID Readiness (v49)

What this prepares for:
- Government / wallet-based digital identity handoff (future)
- W3C Verifiable Credentials (VC Data Model 2.0) parsing scaffold
- ISO/IEC 18013-5 mDL / mdoc parsing scaffold

What this does NOT do yet:
- No camera scan UI
- No NFC passport chip reading
- No cryptographic verification
- No storage of sensitive ID data

Important reality notes:
- EU plans to provide an EU Digital Identity Wallet by end of 2026 (per European Commission).
- mDL is standardized under ISO/IEC 18013-5.
- W3C Verifiable Credentials Data Model v2.0 is a W3C Recommendation (May 2025).

Security stance for LionGate Travels:
- Default: process in-memory only, no persistence
- Require user confirmation before using extracted data
- Keep TEST MODE only until explicit Live enablement
