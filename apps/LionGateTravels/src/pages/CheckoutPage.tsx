import React, { useState } from 'react';
import Page from '../layouts/Page';
import Card from '../components/Card';
import Button from '../components/Button';
import type { TripOrder } from './TripDetailsPage';

type CheckoutPageProps = {
  order: TripOrder;
  onBack: () => void;
  onConfirm: () => void;
};

export default function CheckoutPage({ order, onBack, onConfirm }: CheckoutPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleConfirm = () => {
    if (!fullName || !email || !cardNumber || !expiry || !cvc) {
      alert('Please fill in all required fields before confirming.');
      return;
    }

    onConfirm();
  };

  const { tripDetails, pricing, selections } = order;

  return (
    <Page>
      <h2>Checkout</h2>
      <p>Review your trip and enter passenger and payment details.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', marginTop: '16px' }}>
        <Card>
          <h3>Passenger Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <h3 style={{ marginTop: '16px' }}>Payment Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              placeholder="Card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <Button onClick={onBack}>Back to Trip Details</Button>
            <Button onClick={handleConfirm}>Confirm Booking</Button>
          </div>
        </Card>

        <Card>
          <h3>Order Summary</h3>
          <p>
            <strong>From:</strong> {tripDetails.from} &rarr; <strong>To:</strong> {tripDetails.to}
          </p>
          <p>
            <strong>Depart:</strong> {tripDetails.departDate || 'TBD'} &nbsp;|&nbsp;
            <strong>Return:</strong> {tripDetails.returnDate || 'TBD'}
          </p>
          <p>
            <strong>Passengers:</strong> {tripDetails.passengers}
          </p>
          <hr />
          <p>
            <strong>Seat type:</strong> {selections.seatType}
          </p>
          <p>
            <strong>Bags:</strong> {selections.bags}
          </p>
          <p>
            <strong>Wi-Fi:</strong> {selections.extrasWifi ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Priority boarding:</strong> {selections.extrasPriority ? 'Yes' : 'No'}
          </p>
          <hr />
          <p>
            <strong>Base fare:</strong> ${pricing.baseFare.toFixed(2)}
          </p>
          <p>
            <strong>Taxes & fees:</strong> ${pricing.taxes.toFixed(2)}
          </p>
          <p>
            <strong>Extras:</strong> ${pricing.extrasTotal.toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> ${pricing.total.toFixed(2)}
          </p>
        </Card>
      </div>
    </Page>
  );
}
