
import React from 'react';
import Card from '../components/Card';

type TripDetailsProps = {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  baseFare: number;
  taxes: number;
  extrasTotal: number;
  total: number;
};

export default function TripDetailsCapsule({
  from,
  to,
  departDate,
  returnDate,
  passengers,
  baseFare,
  taxes,
  extrasTotal,
  total,
}: TripDetailsProps) {
  return (
    <Card title="Trip Overview" accent="blue">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 1fr',
          columnGap: '16px',
          rowGap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#92a4ff',
              marginBottom: '4px',
            }}
          >
            ROUTE
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {from || 'TBD'} <span style={{ opacity: 0.6 }}>→</span> {to || 'TBD'}
          </div>
          <div style={{ fontSize: '0.86rem', color: '#c1c9ff', marginTop: '6px' }}>
            Depart:&nbsp;
            <span style={{ fontWeight: 500 }}>{departDate || 'TBD'}</span>
            <span style={{ opacity: 0.5 }}> &nbsp;•&nbsp; </span>
            Return:&nbsp;
            <span style={{ fontWeight: 500 }}>{returnDate || 'TBD'}</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#a6b0ff', marginTop: '4px' }}>
            Travelers: <span style={{ fontWeight: 500 }}>{passengers}</span>
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#92a4ff',
              marginBottom: '4px',
            }}
          >
            PRICE SUMMARY
          </div>
          <dl
            style={{
              margin: 0,
              fontSize: '0.86rem',
              display: 'grid',
              gridTemplateColumns: '1.2fr auto',
              rowGap: '4px',
            }}
          >
            <dt style={{ opacity: 0.8 }}>Base fare</dt>
            <dd style={{ margin: 0, textAlign: 'right' }}>${baseFare.toFixed(2)}</dd>
            <dt style={{ opacity: 0.8 }}>Taxes & fees</dt>
            <dd style={{ margin: 0, textAlign: 'right' }}>${taxes.toFixed(2)}</dd>
            <dt style={{ opacity: 0.8 }}>Extras</dt>
            <dd style={{ margin: 0, textAlign: 'right' }}>${extrasTotal.toFixed(2)}</dd>
            <dt
              style={{
                borderTop: '1px dashed rgba(150, 166, 240, 0.6)',
                paddingTop: '4px',
                marginTop: '4px',
                fontWeight: 600,
              }}
            >
              Total
            </dt>
            <dd
              style={{
                margin: 0,
                textAlign: 'right',
                borderTop: '1px dashed rgba(150, 166, 240, 0.6)',
                paddingTop: '4px',
                marginTop: '4px',
                fontWeight: 700,
                color: '#fefeff',
              }}
            >
              ${total.toFixed(2)}
            </dd>
          </dl>
        </div>
      </div>
    </Card>
  );
}
