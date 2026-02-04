import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '../components/Card';
import Button from '../components/Button';
export default function FlightResultCardCapsule({ airline, departTime, arriveTime, duration, price, onSelect, }) {
    return (_jsx(Card, { accent: "teal", children: _jsxs("div", { style: {
                display: 'grid',
                gridTemplateColumns: '1.4fr 1.2fr auto',
                gap: '12px',
                alignItems: 'center',
            }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8fa2ff' }, children: "FLIGHT OPTION" }), _jsx("div", { style: { fontSize: '1.05rem', fontWeight: 600, color: '#f5f7ff', marginTop: '2px' }, children: airline }), _jsxs("div", { style: { fontSize: '0.85rem', color: '#c2cdfd', marginTop: '4px' }, children: [_jsx("span", { style: { fontWeight: 500 }, children: departTime }), " \u00A0\u2192\u00A0", _jsx("span", { style: { fontWeight: 500 }, children: arriveTime })] }), _jsxs("div", { style: { fontSize: '0.8rem', color: '#9aa6e8', marginTop: '2px' }, children: ["Duration: ", duration] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8aa0ff' }, children: "FROM" }), _jsxs("div", { style: { fontSize: '1.1rem', fontWeight: 700, color: '#fafeff', marginTop: '4px' }, children: ["$", price.toFixed(2)] }), _jsx("div", { style: { fontSize: '0.78rem', color: '#9da9f2', marginTop: '2px' }, children: "per traveler, before extras" })] }), _jsx("div", { style: { textAlign: 'right' }, children: _jsx(Button, { onClick: onSelect, children: "Select Flight" }) })] }) }));
}
