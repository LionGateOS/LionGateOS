import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
export default function SearchCapsule({ onSearch }) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [depart, setDepart] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const handleSearch = () => {
        const data = {
            from,
            to,
            departDate: depart,
            returnDate,
            passengers,
        };
        onSearch(data);
    };
    return (_jsxs(Card, { children: [_jsx("h3", { children: "Search Flights" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: [_jsx("input", { placeholder: "Departure Airport", value: from, onChange: (e) => setFrom(e.target.value), style: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' } }), _jsx("input", { placeholder: "Arrival Airport", value: to, onChange: (e) => setTo(e.target.value), style: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' } }), _jsx("input", { type: "date", value: depart, onChange: (e) => setDepart(e.target.value), style: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' } }), _jsx("input", { type: "date", value: returnDate, onChange: (e) => setReturnDate(e.target.value), style: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' } }), _jsx("input", { type: "number", min: 1, value: passengers, onChange: (e) => setPassengers(parseInt(e.target.value || '1', 10)), style: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' } }), _jsx(Button, { onClick: handleSearch, children: "Search & Continue" })] })] }));
}
