// I:\LionGateOS\types.ts
// Shared interfaces for LionGateOS project

/**
 * Interface for daily weather data from Open-Meteo API.
 */
export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

/**
 * Interface for the response structure of the Open-Meteo API.
 */
export interface OpenMeteoResponse {
  daily?: DailyData;
}

/**
 * Interface for a category in the Teleport API response.
 */
export interface TeleportCategory {
  score_out_of_10: number;
  name: string;
}

/**
 * Interface for the response structure of the Teleport API.
 */
export interface TeleportResponse {
  summary?: string;
  categories?: TeleportCategory[];
}

/**
 * Interface for the input to an audit entry.
 */
export interface AuditEntryInput {
  action: string;
  ref: string;
  vendor: string;
}

/**
 * Interface for a complete audit entry, including timestamp and mode.
 */
export interface AuditEntry extends AuditEntryInput {
  timestamp: string;
  mode: 'TEST' | 'PRODUCTION'; // Assuming 'TEST' for now based on audit.writer.js
}

/**
 * Interface for the structure of the audit log file.
 */
export interface AuditLog {
  entries: AuditEntry[];
}

/**
 * Interface for a standardized error response.
 */
export interface ErrorResponse {
  ok: boolean;
  message: string;
  context: { [key: string]: any }; // Using any for context for now, can be refined
}

/**
 * Type for the detected kind of Digital ID.
 */
export type IdKind = 'w3c_vc' | 'iso_mdoc_mdl' | 'unknown';

/**
 * Interface for the result of parsing a Digital ID.
 */
export interface DigitalIdParseResult {
  ok: boolean;
  kind?: IdKind;
  raw?: object;
  error?: string;
}



