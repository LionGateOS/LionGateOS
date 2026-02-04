import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '../components/Card';
import Panel from '../components/Panel';
import Button from '../components/Button';
export default function TripBuilderCapsule({ bags, seatType, extrasWifi, extrasPriority, onBagsChange, onSeatTypeChange, onExtrasWifiChange, onExtrasPriorityChange, summary, onContinue, }) {
    const handleBagsChange = (e) => {
        const value = parseInt(e.target.value || '0', 10);
        onBagsChange(Number.isNaN(value) ? 0 : value);
    };
    return (_jsxs(Card, { title: "Trip Builder", accent: "purple", children: [_jsx(Panel, { title: "Checked Bags", children: _jsxs("div", { style: { display: 'flex', gap: '10px', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: '0.9rem' }, children: "Bags per traveler" }), _jsx("input", { type: "number", min: 0, max: 4, value: bags, onChange: handleBagsChange, style: {
                                width: '64px',
                                padding: '6px 8px',
                                borderRadius: '999px',
                                border: '1px solid rgba(143, 163, 255, 0.9)',
                                background: 'rgba(5, 9, 30, 0.95)',
                                color: '#eef0ff',
                                fontSize: '0.9rem',
                                textAlign: 'center',
                            } })] }) }), _jsx(Panel, { title: "Seat Type", children: _jsx("div", { style: { display: 'flex', gap: '8px' }, children: ['ECONOMY', 'PREMIUM', 'BUSINESS'].map((type) => {
                        const isActive = seatType === type;
                        return (_jsx("button", { onClick: () => onSeatTypeChange(type), style: {
                                padding: '6px 10px',
                                borderRadius: '999px',
                                border: isActive
                                    ? '1px solid rgba(104, 151, 255, 0.95)'
                                    : '1px solid rgba(88, 108, 180, 0.7)',
                                background: isActive
                                    ? 'radial-gradient(circle at 0 0, #5a8bff, #3240a8)'
                                    : 'rgba(9, 14, 40, 0.92)',
                                color: isActive ? '#f9fbff' : '#cdd6ff',
                                fontSize: '0.8rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                minWidth: '90px',
                            }, children: type }, type));
                    }) }) }), _jsxs(Panel, { title: "Extras", children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }, children: [_jsx("input", { type: "checkbox", checked: extrasWifi, onChange: (e) => onExtrasWifiChange(e.target.checked) }), _jsx("span", { style: { fontSize: '0.9rem' }, children: "In-flight Wi\u2011Fi" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("input", { type: "checkbox", checked: extrasPriority, onChange: (e) => onExtrasPriorityChange(e.target.checked) }), _jsx("span", { style: { fontSize: '0.9rem' }, children: "Priority boarding" })] })] }), _jsx(Panel, { title: "Price Summary", children: _jsxs("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: '1.2fr auto',
                        rowGap: '4px',
                        fontSize: '0.9rem',
                    }, children: [_jsx("span", { children: "Base fare" }), _jsxs("span", { style: { textAlign: 'right' }, children: ["$", summary.baseFare.toFixed(2)] }), _jsx("span", { children: "Taxes & fees" }), _jsxs("span", { style: { textAlign: 'right' }, children: ["$", summary.taxes.toFixed(2)] }), _jsx("span", { children: "Extras" }), _jsxs("span", { style: { textAlign: 'right' }, children: ["$", summary.extrasTotal.toFixed(2)] }), _jsx("span", { style: {
                                borderTop: '1px dashed rgba(138, 157, 241, 0.8)',
                                paddingTop: '4px',
                                marginTop: '4px',
                                fontWeight: 600,
                            }, children: "Total" }), _jsxs("span", { style: {
                                textAlign: 'right',
                                borderTop: '1px dashed rgba(138, 157, 241, 0.8)',
                                paddingTop: '4px',
                                marginTop: '4px',
                                fontWeight: 700,
                            }, children: ["$", summary.total.toFixed(2)] })] }) }), _jsx("div", { style: { marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }, children: _jsx(Button, { onClick: onContinue, children: "Continue to Checkout" }) })] }));
}
