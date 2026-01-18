export interface BusinessProfile {
  businessName: string;
  legalName: string;
  jurisdiction: string;
  status: string;
  industry?: string;
  size?: string;
  flags?: string[];
}
