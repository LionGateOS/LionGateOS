import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RiskZone, Severity } from '../services/GlobalTruthLogic';

interface GlobalMonitorState {
  activeZone: RiskZone | null;
  activeSeverity: Severity | null;
  setMonitor: (zone: RiskZone | null, severity: Severity | null) => void;
}

const GlobalMonitorContext = createContext<GlobalMonitorState | undefined>(undefined);

export const GlobalMonitorProvider = ({ children }: { children: ReactNode }) => {
  const [activeZone, setActiveZone] = useState<RiskZone | null>(null);
  const [activeSeverity, setActiveSeverity] = useState<Severity | null>(null);

  const setMonitor = (zone: RiskZone | null, severity: Severity | null) => {
    setActiveZone(zone);
    setActiveSeverity(severity);
  };

  return (
    <GlobalMonitorContext.Provider value={{ activeZone, activeSeverity, setMonitor }}>
      {children}
    </GlobalMonitorContext.Provider>
  );
};

export const useGlobalMonitor = () => {
  const context = useContext(GlobalMonitorContext);
  if (!context) {
    throw new Error('useGlobalMonitor must be used within a GlobalMonitorProvider');
  }
  return context;
};
