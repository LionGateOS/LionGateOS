
import React, { useMemo } from 'react';
import Page from '../layouts/Page';
import FlightResultCardCapsule from '../capsules/FlightResultCardCapsule';
import Button from '../components/Button';

type FlightResultsPageProps = {
  search: {
    from: string;
    to: string;
    departDate: string;
    returnDate: string;
    passengers: number;
  };
  onBack: () => void;
  onSelectFlight: (flight: FlightOption) => void;
};

export type FlightOption = {
  id: string;
  airline: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  baseFarePerPassenger: number;
};

export default function FlightResultsPage({
  search,
  onBack,
  onSelectFlight,
}: FlightResultsPageProps) {
  const flights: FlightOption[] = useMemo(
    () => [
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
    ],
    []
  );

  const title =
    search.from && search.to
      ? `${search.from.toUpperCase()} → ${search.to.toUpperCase()}`
      : 'Available Flights';

  return (
    <Page>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Button variant="ghost" onClick={onBack}>
          ← Back to Search
        </Button>
        <div
          style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: '#9ba7ff',
          }}
        >
          STEP 2 · SELECT FLIGHT
        </div>
      </div>

      <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem' }}>{title}</h2>
      <p style={{ margin: '0 0 18px', fontSize: '0.92rem', color: '#c3ccff' }}>
        Choose a sample flight option. In the future, this screen will be powered by live airline APIs.
      </p>

      <div style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>
        {flights.map((flight) => (
          <FlightResultCardCapsule
            key={flight.id}
            airline={flight.airline}
            departTime={flight.departTime}
            arriveTime={flight.arriveTime}
            duration={flight.duration}
            price={flight.baseFarePerPassenger}
            onSelect={() => onSelectFlight(flight)}
          />
        ))}
      </div>
    </Page>
  );
}
