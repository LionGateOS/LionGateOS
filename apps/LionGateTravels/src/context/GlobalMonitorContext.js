import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const GlobalMonitorContext = createContext(undefined);
export const GlobalMonitorProvider = ({ children }) => {
    const [activeZone, setActiveZone] = useState(null);
    const [activeSeverity, setActiveSeverity] = useState(null);
    const setMonitor = (zone, severity) => {
        setActiveZone(zone);
        setActiveSeverity(severity);
    };
    return (_jsx(GlobalMonitorContext.Provider, { value: { activeZone, activeSeverity, setMonitor }, children: children }));
};
export const useGlobalMonitor = () => {
    const context = useContext(GlobalMonitorContext);
    if (!context) {
        throw new Error('useGlobalMonitor must be used within a GlobalMonitorProvider');
    }
    return context;
};
