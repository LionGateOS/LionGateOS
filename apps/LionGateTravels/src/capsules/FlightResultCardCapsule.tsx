
import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

type FlightResultCardCapsuleProps = {
  airline: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  onSelect: () => void;
};

export default function FlightResultCardCapsule({
  airline,
  departTime,
  arriveTime,
  duration,
  price,
  onSelect,
}: FlightResultCardCapsuleProps) {
  return (
    <Card accent="teal">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1.2fr auto',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8fa2ff' }}>
            FLIGHT OPTION
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5f7ff', marginTop: '2px' }}>
            {airline}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#c2cdfd', marginTop: '4px' }}>
            <span style={{ fontWeight: 500 }}>{departTime}</span> &nbsp;→&nbsp;
            <span style={{ fontWeight: 500 }}>{arriveTime}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9aa6e8', marginTop: '2px' }}>Duration: {duration}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8aa0ff' }}>
            FROM
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fafeff', marginTop: '4px' }}>
            ${price.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9da9f2', marginTop: '2px' }}>per traveler, before extras</div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onSelect}>Select Flight</Button>
        </div>
      </div>
    </Card>
  );
}
