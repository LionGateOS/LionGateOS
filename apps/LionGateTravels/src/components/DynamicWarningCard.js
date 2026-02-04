import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGlobalMonitor } from '../context/GlobalMonitorContext';
export const DynamicWarningCard = ({ zone, severity, title, message }) => {
    const { setMonitor } = useGlobalMonitor();
    const getSeverityColor = (sev) => {
        switch (sev) {
            case 'Low': return 'var(--lg-success, #4ade80)';
            case 'Medium': return 'var(--lg-warning, #facc15)';
            case 'High': return 'var(--lg-error, #f87171)';
            case 'Critical': return 'var(--lg-critical, #ef4444)';
            default: return 'var(--lg-text-muted)';
        }
    };
    const color = getSeverityColor(severity);
    return (_jsxs("div", { className: "lg-card", style: {
            borderLeft: `4px solid ${color}`,
            background: 'rgba(20, 28, 50, 0.4)', // Slightly darker for contrast
            backdropFilter: 'blur(12px)',
            padding: '16px',
            marginBottom: '12px',
            cursor: 'crosshair',
            transition: 'all 0.2s ease'
        }, onMouseEnter: () => setMonitor(zone, severity), onMouseLeave: () => setMonitor(null, null), children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsx("span", { style: {
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: 700,
                            color: color,
                            border: `1px solid ${color}`,
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }, children: zone }), _jsxs("span", { style: { fontSize: '11px', color: 'var(--lg-text-muted)' }, children: [severity.toUpperCase(), " SEVERITY"] })] }), _jsx("h4", { style: { margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }, children: title }), _jsx("p", { style: { margin: 0, fontSize: '14px', color: 'var(--lg-text-muted)', lineHeight: 1.5 }, children: message })] }));
};
