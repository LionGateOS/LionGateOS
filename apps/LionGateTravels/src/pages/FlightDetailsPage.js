import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Page from '../layouts/Page';
import Button from '../components/Button';
import Card from '../components/Card';
export default function FlightDetailsPage({ flight, onBack, onContinue, }) {
    if (!flight) {
        return (_jsxs(Page, { children: [_jsx("p", { children: "No flight selected." }), _jsx("div", { style: { marginTop: '16px' }, children: _jsx(Button, { onClick: onBack, children: "Back to Results" }) })] }));
    }
    const estimatedTaxes = flight.baseFarePerPassenger * 0.22;
    const totalPerTraveler = flight.baseFarePerPassenger + estimatedTaxes;
    return (_jsxs(Page, { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }, children: [_jsx(Button, { variant: "ghost", onClick: onBack, children: "\u2190 Back to Results" }), _jsx("div", { style: {
                            fontSize: '0.78rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.16em',
                            color: '#9ba7ff',
                        }, children: "STEP 3 \u00B7 REVIEW FLIGHT" })] }), _jsx("h2", { style: { margin: '0 0 4px', fontSize: '1.4rem' }, children: "Flight details" }), _jsx("p", { style: { margin: '0 0 18px', fontSize: '0.92rem', color: '#c3ccff' }, children: "Confirm the flight you want to build your trip with. You can still adjust bags, seats, and extras on the next step." }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'flex-start' }, children: [_jsxs(Card, { accent: "teal", children: [_jsx("div", { style: {
                                    fontSize: '0.78rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.14em',
                                    color: '#8fa0ff',
                                    marginBottom: '6px',
                                }, children: "FLIGHT" }), _jsx("div", { style: { fontSize: '1.1rem', fontWeight: 600 }, children: flight.airline }), _jsxs("div", { style: { fontSize: '0.9rem', color: '#c4ccff', marginTop: '6px' }, children: [_jsx("span", { style: { fontWeight: 600 }, children: flight.departTime }), " \u00A0\u2192\u00A0", _jsx("span", { style: { fontWeight: 600 }, children: flight.arriveTime })] }), _jsxs("div", { style: { fontSize: '0.86rem', color: '#9da7f5', marginTop: '4px' }, children: ["Duration: ", flight.duration] })] }), _jsxs(Card, { accent: "blue", children: [_jsx("div", { style: {
                                    fontSize: '0.78rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.14em',
                                    color: '#8fa0ff',
                                    marginBottom: '6px',
                                }, children: "ESTIMATED PER TRAVELER" }), _jsxs("dl", { style: {
                                    margin: 0,
                                    fontSize: '0.9rem',
                                    display: 'grid',
                                    gridTemplateColumns: '1.4fr auto',
                                    rowGap: '4px',
                                }, children: [_jsx("dt", { children: "Base fare" }), _jsxs("dd", { style: { margin: 0, textAlign: 'right' }, children: ["$", flight.baseFarePerPassenger.toFixed(2)] }), _jsx("dt", { children: "Estimated taxes & fees" }), _jsxs("dd", { style: { margin: 0, textAlign: 'right' }, children: ["$", estimatedTaxes.toFixed(2)] }), _jsx("dt", { style: {
                                            borderTop: '1px dashed rgba(149, 167, 245, 0.9)',
                                            paddingTop: '4px',
                                            marginTop: '4px',
                                            fontWeight: 600,
                                        }, children: "Est. total per traveler" }), _jsxs("dd", { style: {
                                            margin: 0,
                                            textAlign: 'right',
                                            borderTop: '1px dashed rgba(149, 167, 245, 0.9)',
                                            paddingTop: '4px',
                                            marginTop: '4px',
                                            fontWeight: 700,
                                        }, children: ["$", totalPerTraveler.toFixed(2)] })] })] })] }), _jsxs("div", { style: {
                    marginTop: '18px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                }, children: [_jsx(Button, { variant: "ghost", onClick: onBack, children: "Back" }), _jsx(Button, { onClick: onContinue, children: "Continue to Trip Details" })] })] }));
}
