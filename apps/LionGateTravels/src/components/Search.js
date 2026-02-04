import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * SEARCH COMPONENT
 *
 * Main search interface for LionGateOS Travels
 * Integrated with real Expedia Rapid APIs
 */
import React from 'react';
import { UnifiedSearchService } from '../services/search.services';
import { HotelResultCard } from './HotelResultCard';
import { CarResultCard } from './CarResultCard';
import { ActivityResultCard } from './ActivityResultCard';
import logo from '../assets/logo.png';
import './Search.css';
export const Search = () => {
    const [formData, setFormData] = React.useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        adults: 2,
        children: 0,
    });
    const [isSearching, setIsSearching] = React.useState(false);
    const [results, setResults] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('hotels');
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!formData.destination || !formData.checkIn || !formData.checkOut) {
            alert('Please fill in all required fields');
            return;
        }
        setIsSearching(true);
        setResults(null);
        try {
            const searchResults = await UnifiedSearchService.searchAll({
                location: { destination: formData.destination },
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                guests: {
                    adults: formData.adults,
                    children: formData.children || undefined,
                },
                currency: 'USD',
            });
            setResults(searchResults);
        }
        catch (error) {
            console.error('Search failed:', error);
            alert('Search failed. Please try again.');
        }
        finally {
            setIsSearching(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    // Get tomorrow's date as default check-in
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultCheckIn = tomorrow.toISOString().split('T')[0];
    // Get day after tomorrow as default check-out
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const defaultCheckOut = dayAfter.toISOString().split('T')[0];
    return (_jsxs("div", { className: "travels-search", children: [_jsxs("div", { className: "travels-search-header", children: [_jsx("img", { src: logo, alt: "LionGateOS Travels", className: "travels-logo" }), _jsx("p", { className: "travels-tagline", children: "Plan your journey worldwide with real-time availability" })] }), _jsxs("form", { className: "travels-search-form", onSubmit: handleSearch, children: [_jsx("div", { className: "travels-form-row", children: _jsxs("div", { className: "travels-form-field travels-form-field--large", children: [_jsx("label", { htmlFor: "destination", children: "Where to?" }), _jsx("input", { id: "destination", type: "text", placeholder: "City, hotel, or landmark", value: formData.destination, onChange: (e) => handleInputChange('destination', e.target.value), className: "travels-input", required: true })] }) }), _jsxs("div", { className: "travels-form-row", children: [_jsxs("div", { className: "travels-form-field", children: [_jsx("label", { htmlFor: "checkIn", children: "Check-in" }), _jsx("input", { id: "checkIn", type: "date", value: formData.checkIn || defaultCheckIn, onChange: (e) => handleInputChange('checkIn', e.target.value), min: defaultCheckIn, className: "travels-input", required: true })] }), _jsxs("div", { className: "travels-form-field", children: [_jsx("label", { htmlFor: "checkOut", children: "Check-out" }), _jsx("input", { id: "checkOut", type: "date", value: formData.checkOut || defaultCheckOut, onChange: (e) => handleInputChange('checkOut', e.target.value), min: formData.checkIn || defaultCheckIn, className: "travels-input", required: true })] }), _jsxs("div", { className: "travels-form-field travels-form-field--small", children: [_jsx("label", { htmlFor: "adults", children: "Adults" }), _jsx("input", { id: "adults", type: "number", min: "1", max: "10", value: formData.adults, onChange: (e) => handleInputChange('adults', parseInt(e.target.value)), className: "travels-input", required: true })] }), _jsxs("div", { className: "travels-form-field travels-form-field--small", children: [_jsx("label", { htmlFor: "children", children: "Children" }), _jsx("input", { id: "children", type: "number", min: "0", max: "10", value: formData.children, onChange: (e) => handleInputChange('children', parseInt(e.target.value)), className: "travels-input" })] })] }), _jsx("button", { type: "submit", className: "travels-search-btn", disabled: isSearching, children: isSearching ? 'Searching worldwide...' : 'Search' })] }), isSearching && (_jsxs("div", { className: "travels-loading", children: [_jsx("div", { className: "travels-loading-spinner" }), _jsx("p", { children: "Searching Expedia Rapid API..." })] })), results && !isSearching && (_jsxs("div", { className: "travels-results", children: [_jsxs("div", { className: "travels-results-tabs", children: [_jsxs("button", { className: `travels-tab ${activeTab === 'hotels' ? 'travels-tab--active' : ''}`, onClick: () => setActiveTab('hotels'), children: ["Hotels (", results.hotels.length, ")"] }), _jsxs("button", { className: `travels-tab ${activeTab === 'cars' ? 'travels-tab--active' : ''}`, onClick: () => setActiveTab('cars'), children: ["Cars (", results.cars.length, ")"] }), _jsxs("button", { className: `travels-tab ${activeTab === 'activities' ? 'travels-tab--active' : ''}`, onClick: () => setActiveTab('activities'), children: ["Activities (", results.activities.length, ")"] })] }), _jsxs("div", { className: "travels-results-content", children: [activeTab === 'hotels' && (_jsx("div", { className: "travels-results-list", children: results.hotels.length === 0 ? (_jsx("p", { className: "travels-no-results", children: "No hotels found. Try a different search." })) : (results.hotels.map(hotel => (_jsx(HotelResultCard, { hotel: hotel }, hotel.id)))) })), activeTab === 'cars' && (_jsx("div", { className: "travels-results-list", children: results.cars.length === 0 ? (_jsx("p", { className: "travels-no-results", children: "No car rentals found. Try a different search." })) : (results.cars.map(car => (_jsx(CarResultCard, { car: car }, car.id)))) })), activeTab === 'activities' && (_jsx("div", { className: "travels-results-list", children: results.activities.length === 0 ? (_jsx("p", { className: "travels-no-results", children: "No activities found. Try a different search." })) : (results.activities.map(activity => (_jsx(ActivityResultCard, { activity: activity }, activity.id)))) }))] }), _jsx("div", { className: "travels-disclosure", children: _jsxs("p", { children: [_jsx("strong", { children: "Transparency Notice:" }), " Prices and availability are provided by Expedia. LionGateOS Travels displays information only. Booking happens on Expedia. We may earn an affiliate commission."] }) })] }))] }));
};
