import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Page from '../layouts/Page';
import SearchCapsule from '../capsules/SearchCapsule';
import Button from '../components/Button';
import TripDetailsPage from './TripDetailsPage';
import CheckoutPage from './CheckoutPage';
import FlightResultsPage from './FlightResultsPage';
import FlightDetailsPage from './FlightDetailsPage';
export default function Home() {
    const [view, setView] = useState('SEARCH');
    const [searchData, setSearchData] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [order, setOrder] = useState(null);
    const handleSearch = (data) => {
        setSearchData(data);
        setSelectedFlight(null);
        setOrder(null);
        setView('RESULTS');
    };
    const handleFlightSelected = (flight) => {
        setSelectedFlight(flight);
        setView('FLIGHT_DETAILS');
    };
    const handleProceedFromFlightDetails = () => {
        setView('TRIP_DETAILS');
    };
    const handleCheckoutStart = (newOrder) => {
        setOrder(newOrder);
        window.open('https://www.expedia.com', '_blank', 'noopener,noreferrer');
    };
    const handleBookingConfirmed = () => {
        setView('CONFIRMED');
    };
    if (view === 'CHECKOUT' && order) {
        return (_jsx(CheckoutPage, { order: order, onBack: () => setView('TRIP_DETAILS'), onConfirm: handleBookingConfirmed }));
    }
    if (view === 'RESULTS' && searchData) {
        return (_jsx(FlightResultsPage, { search: searchData, onBack: () => setView('SEARCH'), onSelectFlight: handleFlightSelected }));
    }
    if (view === 'FLIGHT_DETAILS' && selectedFlight) {
        return (_jsx(FlightDetailsPage, { flight: selectedFlight, onBack: () => setView('RESULTS'), onContinue: handleProceedFromFlightDetails }));
    }
    if (view === 'TRIP_DETAILS' && searchData) {
        const baseFarePerPassengerOverride = selectedFlight?.baseFarePerPassenger;
        return (_jsx(TripDetailsPage, { from: searchData.from, to: searchData.to, departDate: searchData.departDate, returnDate: searchData.returnDate, passengers: searchData.passengers, baseFarePerPassengerOverride: baseFarePerPassengerOverride, onCheckout: handleCheckoutStart }));
    }
    if (view === 'CONFIRMED' && order) {
        return (_jsxs(Page, { children: [_jsx("div", { style: {
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        color: '#9ba7ff',
                        marginBottom: '12px',
                    }, children: "STEP 6 \u00B7 CONFIRMATION" }), _jsx("h2", { style: { margin: '0 0 8px', fontSize: '1.4rem' }, children: "Booking confirmed" }), _jsx("p", { style: { margin: '0 0 18px', fontSize: '0.94rem', color: '#c6cffd' }, children: "This is a simulated confirmation screen. In a future version, this step will connect to real payment and notification services." }), _jsxs("p", { children: [_jsx("strong", { children: "Route:" }), " ", order.tripDetails.from, " \u2192 ", order.tripDetails.to] }), _jsxs("p", { children: [_jsx("strong", { children: "Total paid:" }), " $", order.pricing.total.toFixed(2)] }), _jsx("div", { style: { marginTop: '18px' }, children: _jsx(Button, { onClick: () => setView('SEARCH'), children: "Start a new search" }) })] }));
    }
    return (_jsxs(Page, { children: [_jsx("div", { style: {
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: '#9ba7ff',
                    marginBottom: '12px',
                }, children: "STEP 1 \u00B7 SEARCH" }), _jsx(SearchCapsule, { onSearch: handleSearch })] }));
}
