import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Panel({ title, children }) {
    return (_jsxs("div", { style: {
            borderRadius: '12px',
            border: '1px solid rgba(103, 126, 210, 0.7)',
            background: 'linear-gradient(135deg, rgba(9, 14, 40, 0.8), rgba(14, 23, 60, 0.95))',
            padding: '10px 12px 12px',
            marginBottom: '10px',
        }, children: [_jsx("div", { style: {
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#9ba7ff',
                    marginBottom: '6px',
                }, children: title }), _jsx("div", { style: { fontSize: '0.9rem' }, children: children })] }));
}
