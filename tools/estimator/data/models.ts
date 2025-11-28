export interface EstimatorPreset {
  id: string;
  name: string;
  category: "framing" | "drywall" | "bathroom" | "electrical" | "other";
  description: string;
}
