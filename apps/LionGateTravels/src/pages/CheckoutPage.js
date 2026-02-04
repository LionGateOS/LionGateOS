import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Page from '../layouts/Page';
import Card from '../components/Card';
import Button from '../components/Button';
export default function CheckoutPage({ order, onBack, onConfirm }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const handleConfirm = () => {
        if (!fullName || !email) {
            alert('Please fill in all required fields before confirming.');
            return;
        }
        onConfirm();
    };
    const { tripDetails, pricing, selections } = order;
    return (_jsxs(Page, { children: [_jsx("h2", { children: "Checkout" }), _jsx("p", { children: "Review your trip and enter passenger and payment details." }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', marginTop: '16px' }, children: [_jsxs(Card, { children: [_jsx("h3", { children: "Passenger Information" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [_jsx("input", { placeholder: "Full name", value: fullName, onChange: (e) => setFullName(e.target.value), style: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' } }), _jsx("input", { placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), style: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' } })] }), _jsx("h3", { style: { marginTop: '16px' }, children: "Payment Details" }), _jsxs("div", { style: { padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'center' }, children: [_jsx("p", { style: { margin: 0, fontWeight: 'bold' }, children: "Redirecting to Secure Payment Gateway..." }), _jsx("p", { style: { margin: '8px 0 0 0', fontSize: '0.9em', color: '#666' }, children: "Your transaction will be completed securely on our partner's website." })] }), _jsxs("div", { style: { marginTop: '16px', display: 'flex', gap: '8px' }, children: [_jsx(Button, { onClick: onBack, children: "Back to Trip Details" }), _jsx(Button, { onClick: handleConfirm, children: "Confirm Booking" })] })] }), _jsxs(Card, { children: [_jsx("h3", { children: "Order Summary" }), _jsxs("p", { children: [_jsx("strong", { children: "From:" }), " ", tripDetails.from, " \u2192 ", _jsx("strong", { children: "To:" }), " ", tripDetails.to] }), _jsxs("p", { children: [_jsx("strong", { children: "Depart:" }), " ", tripDetails.departDate || 'TBD', " \u00A0|\u00A0", _jsx("strong", { children: "Return:" }), " ", tripDetails.returnDate || 'TBD'] }), _jsxs("p", { children: [_jsx("strong", { children: "Passengers:" }), " ", tripDetails.passengers] }), _jsx("hr", {}), _jsxs("p", { children: [_jsx("strong", { children: "Seat type:" }), " ", selections.seatType] }), _jsxs("p", { children: [_jsx("strong", { children: "Bags:" }), " ", selections.bags] }), _jsxs("p", { children: [_jsx("strong", { children: "Wi-Fi:" }), " ", selections.extrasWifi ? 'Yes' : 'No'] }), _jsxs("p", { children: [_jsx("strong", { children: "Priority boarding:" }), " ", selections.extrasPriority ? 'Yes' : 'No'] }), _jsx("hr", {}), _jsxs("p", { children: [_jsx("strong", { children: "Base fare:" }), " $", pricing.baseFare.toFixed(2)] }), _jsxs("p", { children: [_jsx("strong", { children: "Taxes & fees:" }), " $", pricing.taxes.toFixed(2)] }), _jsxs("p", { children: [_jsx("strong", { children: "Extras:" }), " $", pricing.extrasTotal.toFixed(2)] }), _jsxs("p", { children: [_jsx("strong", { children: "Total:" }), " $", pricing.total.toFixed(2)] })] })] })] }));
}
