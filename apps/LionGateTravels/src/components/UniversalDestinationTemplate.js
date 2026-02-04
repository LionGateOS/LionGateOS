import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GlassCard } from './GlassCard';
export const UniversalDestinationTemplate = ({ name, description, type, intelligence }) => {
    return (_jsxs("div", { className: "lg-grid", style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            padding: '20px'
        }, children: [_jsxs(GlassCard, { title: name, subtitle: type.toUpperCase(), children: [_jsx("p", { style: { lineHeight: 1.6, fontSize: '15px' }, children: description }), _jsxs("div", { style: { marginTop: '20px', display: 'flex', gap: '10px' }, children: [_jsx("button", { className: "lg-btn lg-btn--primary", children: "View Details" }), _jsx("button", { className: "lg-btn", children: "Save to Trip" })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '24px' }, children: [_jsx(GlassCard, { title: "\u26A0 Hurricane Warning", style: {
                            borderColor: intelligence.hurricaneWarning ? 'rgba(248,113,113,0.4)' : 'var(--lg-stroke)'
                        }, children: intelligence.hurricaneWarning ? (_jsxs("div", { style: { color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("span", { children: "\uD83C\uDF2A" }), _jsx("span", { children: intelligence.hurricaneWarning })] })) : (_jsx("p", { style: { color: 'var(--lg-text-muted)', fontSize: '14px' }, children: "No active hurricane threats detected for this region." })) }), _jsx(GlassCard, { title: "\uD83E\uDDE0 Cultural Intelligence", children: intelligence.culturalWarning ? (_jsx("div", { style: { padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }, children: _jsx("p", { style: { margin: 0, fontSize: '14px' }, children: intelligence.culturalWarning }) })) : (_jsx("p", { style: { color: 'var(--lg-text-muted)', fontSize: '14px' }, children: "Standard cultural norms apply. No specific warnings." })) })] })] }));
};
