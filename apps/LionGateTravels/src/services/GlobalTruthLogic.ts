// src/services/GlobalTruthLogic.ts

export type RiskZone = 'Geopolitical' | 'Infrastructure' | 'Cultural Taboos' | 'Health' | 'Environment';
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskAssessment {
  zone: RiskZone;
  severity: Severity;
  details: string;
}

/**
 * Global Truth Logic
 * Categorizes incoming data into the 5 Universal Risk Zones.
 */
export const GlobalTruthLogic = {
  // Mapping logic (mocked for this engine build, but structured for real data)
  assess: (category: string, rawData: any): RiskAssessment => {
    // This would contain the complex truth logic.
    // For now, it returns structured objects.
    return {
      zone: category as RiskZone,
      severity: rawData.severity || 'Low',
      details: rawData.message || 'No data available.'
    };
  },

  getPulsePattern: (zone: RiskZone | null, severity: Severity | null) => {
    if (!zone) return { speed: 0.005, spread: 1.0, colorOverride: null };

    let speedBase = 0.005;
    let spreadBase = 1.0;

    // Severity Modifiers
    switch (severity) {
      case 'Low': speedBase = 0.01; break;
      case 'Medium': speedBase = 0.03; spreadBase = 1.2; break;
      case 'High': speedBase = 0.06; spreadBase = 1.5; break;
      case 'Critical': speedBase = 0.12; spreadBase = 2.0; break;
    }

    // Zone Modifiers (Pattern "Flavor")
    // In a real visualizer, this might change particle shapes or noise fields.
    
    return {
      speed: speedBase,
      spread: spreadBase,
    };
  }
};
