export type BusinessStatus = "active" | "inactive" | "suspended" | "unknown";
export type BusinessSize = "solo" | "smb" | "mid" | "enterprise";

export interface LionGateOSBusinessIdentity {
  businessName: string;
  legalName: string;
  jurisdiction: string;
  status: BusinessStatus;
  industry?: string;
  size?: BusinessSize;
  flags?: string[];
}
