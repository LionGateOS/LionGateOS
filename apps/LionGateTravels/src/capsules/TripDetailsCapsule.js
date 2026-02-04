import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '../components/Card';
export default function TripDetailsCapsule({ from, to, departDate, returnDate, passengers, baseFare, taxes, extrasTotal, total, }) {
    return (_jsx(Card, { title: "Trip Overview", accent: "blue", children: _jsxs("div", { style: {
                display: 'grid',
                gridTemplateColumns: '1.3fr 1fr',
                columnGap: '16px',
                rowGap: '10px',
                alignItems: 'flex-start',
            }, children: [_jsxs("div", { children: [_jsx("div", { style: {
                                fontSize: '0.78rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                color: '#92a4ff',
                                marginBottom: '4px',
                            }, children: "ROUTE" }), _jsxs("div", { style: { fontSize: '1.1rem', fontWeight: 600 }, children: [from || 'TBD', " ", _jsx("span", { style: { opacity: 0.6 }, children: "\u2192" }), " ", to || 'TBD'] }), _jsxs("div", { style: { fontSize: '0.86rem', color: '#c1c9ff', marginTop: '6px' }, children: ["Depart:\u00A0", _jsx("span", { style: { fontWeight: 500 }, children: departDate || 'TBD' }), _jsx("span", { style: { opacity: 0.5 }, children: " \u00A0\u2022\u00A0 " }), "Return:\u00A0", _jsx("span", { style: { fontWeight: 500 }, children: returnDate || 'TBD' })] }), _jsxs("div", { style: { fontSize: '0.82rem', color: '#a6b0ff', marginTop: '4px' }, children: ["Travelers: ", _jsx("span", { style: { fontWeight: 500 }, children: passengers })] })] }), _jsxs("div", { children: [_jsx("div", { style: {
                                fontSize: '0.78rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                color: '#92a4ff',
                                marginBottom: '4px',
                            }, children: "PRICE SUMMARY" }), _jsxs("dl", { style: {
                                margin: 0,
                                fontSize: '0.86rem',
                                display: 'grid',
                                gridTemplateColumns: '1.2fr auto',
                                rowGap: '4px',
                            }, children: [_jsx("dt", { style: { opacity: 0.8 }, children: "Base fare" }), _jsxs("dd", { style: { margin: 0, textAlign: 'right' }, children: ["$", baseFare.toFixed(2)] }), _jsx("dt", { style: { opacity: 0.8 }, children: "Taxes & fees" }), _jsxs("dd", { style: { margin: 0, textAlign: 'right' }, children: ["$", taxes.toFixed(2)] }), _jsx("dt", { style: { opacity: 0.8 }, children: "Extras" }), _jsxs("dd", { style: { margin: 0, textAlign: 'right' }, children: ["$", extrasTotal.toFixed(2)] }), _jsx("dt", { style: {
                                        borderTop: '1px dashed rgba(150, 166, 240, 0.6)',
                                        paddingTop: '4px',
                                        marginTop: '4px',
                                        fontWeight: 600,
                                    }, children: "Total" }), _jsxs("dd", { style: {
                                        margin: 0,
                                        textAlign: 'right',
                                        borderTop: '1px dashed rgba(150, 166, 240, 0.6)',
                                        paddingTop: '4px',
                                        marginTop: '4px',
                                        fontWeight: 700,
                                        color: '#fefeff',
                                    }, children: ["$", total.toFixed(2)] })] })] })] }) }));
}
