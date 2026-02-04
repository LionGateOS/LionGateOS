import React from 'react';
import { RiskZone, Severity } from '../services/GlobalTruthLogic';
import { useGlobalMonitor } from '../context/GlobalMonitorContext';

interface DynamicWarningCardProps {
  zone: RiskZone;
  severity: Severity;
  title: string;
  message: string;
}

export const DynamicWarningCard = ({ zone, severity, title, message }: DynamicWarningCardProps) => {
  const { setMonitor } = useGlobalMonitor();

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'Low': return 'var(--lg-success, #4ade80)';
      case 'Medium': return 'var(--lg-warning, #facc15)';
      case 'High': return 'var(--lg-error, #f87171)';
      case 'Critical': return 'var(--lg-critical, #ef4444)';
      default: return 'var(--lg-text-muted)';
    }
  };

  const color = getSeverityColor(severity);

  return (
    <div
      className="lg-card"
      style={{
        borderLeft: `4px solid ${color}`,
        background: 'rgba(20, 28, 50, 0.4)', // Slightly darker for contrast
        backdropFilter: 'blur(12px)',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'crosshair',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={() => setMonitor(zone, severity)}
      onMouseLeave={() => setMonitor(null, null)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          fontWeight: 700, 
          color: color,
          border: `1px solid ${color}`,
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {zone}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--lg-text-muted)' }}>{severity.toUpperCase()} SEVERITY</span>
      </div>
      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--lg-text-muted)', lineHeight: 1.5 }}>
        {message}
      </p>
    </div>
  );
};
