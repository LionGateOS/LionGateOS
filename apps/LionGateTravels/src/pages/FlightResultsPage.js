import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import Page from '../layouts/Page';
import FlightResultCardCapsule from '../capsules/FlightResultCardCapsule';
import Button from '../components/Button';
export default function FlightResultsPage({ search, onBack, onSelectFlight, }) {
    const flights = useMemo(() => [
        {
            id: 'F1',
            airline: 'Skyline Air',
            departTime: '08:15',
            arriveTime: '10:45',
            duration: '2h 30m',
            baseFarePerPassenger: 280,
        },
        {
            id: 'F2',
            airline: 'Aurora Airways',
            departTime: '12:00',
            arriveTime: '14:35',
            duration: '2h 35m',
            baseFarePerPassenger: 320,
        },
        {
            id: 'F3',
            airline: 'NovaJet',
            departTime: '18:10',
            arriveTime: '20:45',
            duration: '2h 35m',
            baseFarePerPassenger: 260,
        },
    ], []);
    const title = search.from && search.to
        ? `${search.from.toUpperCase()} → ${search.to.toUpperCase()}`
        : 'Available Flights';
    return (_jsxs(Page, { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }, children: [_jsx(Button, { variant: "ghost", onClick: onBack, children: "\u2190 Back to Search" }), _jsx("div", { style: {
                            fontSize: '0.78rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.16em',
                            color: '#9ba7ff',
                        }, children: "STEP 2 \u00B7 SELECT FLIGHT" })] }), _jsx("h2", { style: { margin: '0 0 4px', fontSize: '1.4rem' }, children: title }), _jsx("p", { style: { margin: '0 0 18px', fontSize: '0.92rem', color: '#c3ccff' }, children: "Choose a sample flight option. In the future, this screen will be powered by live airline APIs." }), _jsx("div", { style: { display: 'grid', gap: '12px', marginTop: '8px' }, children: flights.map((flight) => (_jsx(FlightResultCardCapsule, { airline: flight.airline, departTime: flight.departTime, arriveTime: flight.arriveTime, duration: flight.duration, price: flight.baseFarePerPassenger, onSelect: () => onSelectFlight(flight) }, flight.id))) })] }));
}
