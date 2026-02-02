
import React from 'react';
import Card from '../components/Card';
import Panel from '../components/Panel';
import Button from '../components/Button';

type SeatType = 'ECONOMY' | 'PREMIUM' | 'BUSINESS';

type TripBuilderCapsuleProps = {
  bags: number;
  seatType: SeatType;
  extrasWifi: boolean;
  extrasPriority: boolean;
  onBagsChange: (bags: number) => void;
  onSeatTypeChange: (seatType: SeatType) => void;
  onExtrasWifiChange: (value: boolean) => void;
  onExtrasPriorityChange: (value: boolean) => void;
  summary: {
    baseFare: number;
    taxes: number;
    extrasTotal: number;
    total: number;
  };
  onContinue: () => void;
};

export default function TripBuilderCapsule({
  bags,
  seatType,
  extrasWifi,
  extrasPriority,
  onBagsChange,
  onSeatTypeChange,
  onExtrasWifiChange,
  onExtrasPriorityChange,
  summary,
  onContinue,
}: TripBuilderCapsuleProps) {
  const handleBagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value || '0', 10);
    onBagsChange(Number.isNaN(value) ? 0 : value);
  };

  return (
    <Card title="Trip Builder" accent="purple">
      <Panel title="Checked Bags">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem' }}>Bags per traveler</span>
          <input
            type="number"
            min={0}
            max={4}
            value={bags}
            onChange={handleBagsChange}
            style={{
              width: '64px',
              padding: '6px 8px',
              borderRadius: '999px',
              border: '1px solid rgba(143, 163, 255, 0.9)',
              background: 'rgba(5, 9, 30, 0.95)',
              color: '#eef0ff',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          />
        </div>
      </Panel>

      <Panel title="Seat Type">
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ECONOMY', 'PREMIUM', 'BUSINESS'] as SeatType[]).map((type) => {
            const isActive = seatType === type;
            return (
              <button
                key={type}
                onClick={() => onSeatTypeChange(type)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
                  border: isActive
                    ? '1px solid rgba(104, 151, 255, 0.95)'
                    : '1px solid rgba(88, 108, 180, 0.7)',
                  background: isActive
                    ? 'radial-gradient(circle at 0 0, #5a8bff, #3240a8)'
                    : 'rgba(9, 14, 40, 0.92)',
                  color: isActive ? '#f9fbff' : '#cdd6ff',
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  minWidth: '90px',
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Extras">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={extrasWifi}
            onChange={(e) => onExtrasWifiChange(e.target.checked)}
          />
          <span style={{ fontSize: '0.9rem' }}>In-flight Wi‑Fi</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={extrasPriority}
            onChange={(e) => onExtrasPriorityChange(e.target.checked)}
          />
          <span style={{ fontSize: '0.9rem' }}>Priority boarding</span>
        </label>
      </Panel>

      <Panel title="Price Summary">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr auto',
            rowGap: '4px',
            fontSize: '0.9rem',
          }}
        >
          <span>Base fare</span>
          <span style={{ textAlign: 'right' }}>${summary.baseFare.toFixed(2)}</span>
          <span>Taxes & fees</span>
          <span style={{ textAlign: 'right' }}>${summary.taxes.toFixed(2)}</span>
          <span>Extras</span>
          <span style={{ textAlign: 'right' }}>${summary.extrasTotal.toFixed(2)}</span>
          <span
            style={{
              borderTop: '1px dashed rgba(138, 157, 241, 0.8)',
              paddingTop: '4px',
              marginTop: '4px',
              fontWeight: 600,
            }}
          >
            Total
          </span>
          <span
            style={{
              textAlign: 'right',
              borderTop: '1px dashed rgba(138, 157, 241, 0.8)',
              paddingTop: '4px',
              marginTop: '4px',
              fontWeight: 700,
            }}
          >
            ${summary.total.toFixed(2)}
          </span>
        </div>
      </Panel>

      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onContinue}>Continue to Checkout</Button>
      </div>
    </Card>
  );
}
