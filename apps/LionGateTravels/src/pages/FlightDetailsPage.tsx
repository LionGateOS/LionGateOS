
import React from 'react';
import Page from '../layouts/Page';
import Button from '../components/Button';
import type { FlightOption } from './FlightResultsPage';
import Card from '../components/Card';

type FlightDetailsPageProps = {
  flight: FlightOption | null;
  onBack: () => void;
  onContinue: () => void;
};

export default function FlightDetailsPage({
  flight,
  onBack,
  onContinue,
}: FlightDetailsPageProps) {
  if (!flight) {
    return (
      <Page>
        <p>No flight selected.</p>
        <div style={{ marginTop: '16px' }}>
          <Button onClick={onBack}>Back to Results</Button>
        </div>
      </Page>
    );
  }

  const estimatedTaxes = flight.baseFarePerPassenger * 0.22;
  const totalPerTraveler = flight.baseFarePerPassenger + estimatedTaxes;

  return (
    <Page>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Button variant="ghost" onClick={onBack}>
          ← Back to Results
        </Button>
        <div
          style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: '#9ba7ff',
          }}
        >
          STEP 3 · REVIEW FLIGHT
        </div>
      </div>

      <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem' }}>Flight details</h2>
      <p style={{ margin: '0 0 18px', fontSize: '0.92rem', color: '#c3ccff' }}>
        Confirm the flight you want to build your trip with. You can still adjust bags, seats, and extras on the next step.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'flex-start' }}>
        <Card accent="teal">
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#8fa0ff',
              marginBottom: '6px',
            }}
          >
            FLIGHT
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{flight.airline}</div>
          <div style={{ fontSize: '0.9rem', color: '#c4ccff', marginTop: '6px' }}>
            <span style={{ fontWeight: 600 }}>{flight.departTime}</span> &nbsp;→&nbsp;
            <span style={{ fontWeight: 600 }}>{flight.arriveTime}</span>
          </div>
          <div style={{ fontSize: '0.86rem', color: '#9da7f5', marginTop: '4px' }}>
            Duration: {flight.duration}
          </div>
        </Card>

        <Card accent="blue">
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#8fa0ff',
              marginBottom: '6px',
            }}
          >
            ESTIMATED PER TRAVELER
          </div>
          <dl
            style={{
              margin: 0,
              fontSize: '0.9rem',
              display: 'grid',
              gridTemplateColumns: '1.4fr auto',
              rowGap: '4px',
            }}
          >
            <dt>Base fare</dt>
            <dd style={{ margin: 0, textAlign: 'right' }}>${flight.baseFarePerPassenger.toFixed(2)}</dd>
            <dt>Estimated taxes & fees</dt>
            <dd style={{ margin: 0, textAlign: 'right' }}>${estimatedTaxes.toFixed(2)}</dd>
            <dt
              style={{
                borderTop: '1px dashed rgba(149, 167, 245, 0.9)',
                paddingTop: '4px',
                marginTop: '4px',
                fontWeight: 600,
              }}
            >
              Est. total per traveler
            </dt>
            <dd
              style={{
                margin: 0,
                textAlign: 'right',
                borderTop: '1px dashed rgba(149, 167, 245, 0.9)',
                paddingTop: '4px',
                marginTop: '4px',
                fontWeight: 700,
              }}
            >
              ${totalPerTraveler.toFixed(2)}
            </dd>
          </dl>
        </Card>
      </div>

      <div
        style={{
          marginTop: '18px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
        }}
      >
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>Continue to Trip Details</Button>
      </div>
    </Page>
  );
}
