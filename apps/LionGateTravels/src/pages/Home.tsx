
import React, { useState } from 'react';
import Page from '../layouts/Page';
import SearchCapsule from '../capsules/SearchCapsule';
import Button from '../components/Button';
import TripDetailsPage, { TripOrder } from './TripDetailsPage';
import CheckoutPage from './CheckoutPage';
import FlightResultsPage, { FlightOption } from './FlightResultsPage';
import FlightDetailsPage from './FlightDetailsPage';

type SearchData = {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
};

type ViewState =
  | 'SEARCH'
  | 'RESULTS'
  | 'FLIGHT_DETAILS'
  | 'TRIP_DETAILS'
  | 'CHECKOUT'
  | 'CONFIRMED';

export default function Home() {
  const [view, setView] = useState<ViewState>('SEARCH');
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [order, setOrder] = useState<TripOrder | null>(null);

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    setSelectedFlight(null);
    setOrder(null);
    setView('RESULTS');
  };

  const handleFlightSelected = (flight: FlightOption) => {
    setSelectedFlight(flight);
    setView('FLIGHT_DETAILS');
  };

  const handleProceedFromFlightDetails = () => {
    setView('TRIP_DETAILS');
  };

  const handleCheckoutStart = (newOrder: TripOrder) => {
    setOrder(newOrder);
    setView('CHECKOUT');
  };

  const handleBookingConfirmed = () => {
    setView('CONFIRMED');
  };

  if (view === 'CHECKOUT' && order) {
    return (
      <CheckoutPage
        order={order}
        onBack={() => setView('TRIP_DETAILS')}
        onConfirm={handleBookingConfirmed}
      />
    );
  }

  if (view === 'RESULTS' && searchData) {
    return (
      <FlightResultsPage
        search={searchData}
        onBack={() => setView('SEARCH')}
        onSelectFlight={handleFlightSelected}
      />
    );
  }

  if (view === 'FLIGHT_DETAILS' && selectedFlight) {
    return (
      <FlightDetailsPage
        flight={selectedFlight}
        onBack={() => setView('RESULTS')}
        onContinue={handleProceedFromFlightDetails}
      />
    );
  }

  if (view === 'TRIP_DETAILS' && searchData) {
    const baseFarePerPassengerOverride = selectedFlight?.baseFarePerPassenger;

    return (
      <TripDetailsPage
        from={searchData.from}
        to={searchData.to}
        departDate={searchData.departDate}
        returnDate={searchData.returnDate}
        passengers={searchData.passengers}
        baseFarePerPassengerOverride={baseFarePerPassengerOverride}
        onCheckout={handleCheckoutStart}
      />
    );
  }

  if (view === 'CONFIRMED' && order) {
    return (
      <Page>
        <div
          style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: '#9ba7ff',
            marginBottom: '12px',
          }}
        >
          STEP 6 · CONFIRMATION
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem' }}>Booking confirmed</h2>
        <p style={{ margin: '0 0 18px', fontSize: '0.94rem', color: '#c6cffd' }}>
          This is a simulated confirmation screen. In a future version, this step will connect to real payment and
          notification services.
        </p>
        <p>
          <strong>Route:</strong> {order.tripDetails.from} → {order.tripDetails.to}
        </p>
        <p>
          <strong>Total paid:</strong> ${order.pricing.total.toFixed(2)}
        </p>
        <div style={{ marginTop: '18px' }}>
          <Button onClick={() => setView('SEARCH')}>Start a new search</Button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div
        style={{
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: '#9ba7ff',
          marginBottom: '12px',
        }}
      >
        STEP 1 · SEARCH
      </div>
      <SearchCapsule onSearch={handleSearch} />
    </Page>
  );
}
