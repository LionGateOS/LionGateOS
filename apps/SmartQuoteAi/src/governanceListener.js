export const applyGovernance = (industry, data) => {
  // Law of Silos (ERR-SILO)
  const isValidSilo = industry === data.context;
  if (!isValidSilo) throw new Error("ERR-SILO: Context Mismatch");
  
  // Law of Value-Density (ERR-VAL)
  const precisionMode = industry === "MEDICAL" ? "DENSITY" : "VALUE";
  
  // Law of Friction (ERR-FRIC)
  if (precisionMode === "DENSITY" && data.confidence < 1.0) {
    throw new Error("ERR-FRIC: 100% Accuracy Required");
  }
  
  return { siloValid: isValidSilo, mode: precisionMode, validated: true };
};