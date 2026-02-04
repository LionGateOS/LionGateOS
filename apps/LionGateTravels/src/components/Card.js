import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Card({ children, title, accent = 'blue' }) {
    const accentColorMap = {
        blue: 'rgba(92, 140, 255, 0.7)',
        teal: 'rgba(63, 201, 199, 0.7)',
        purple: 'rgba(189, 140, 255, 0.7)',
    };
    const accentColor = accentColorMap[accent] || accentColorMap.blue;
    return (_jsxs("section", { style: {
            background: 'radial-gradient(circle at 0 0, rgba(76, 115, 255, 0.08), rgba(5, 9, 30, 0.95))',
            borderRadius: '16px',
            border: `1px solid ${accentColor}`,
            boxShadow: '0 14px 35px rgba(2, 6, 23, 0.85)',
            padding: '16px 18px 18px',
        }, children: [title && (_jsx("header", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '12px',
                }, children: _jsx("h3", { style: {
                        margin: 0,
                        fontSize: '0.95rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#aebdff',
                    }, children: title }) })), _jsx("div", { style: { fontSize: '0.94rem', color: '#e4e8ff' }, children: children })] }));
}
