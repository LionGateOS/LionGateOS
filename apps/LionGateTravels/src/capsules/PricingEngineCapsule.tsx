
import React from 'react';
import Card from '../components/Card';

type PricingEngineCapsuleProps = {
  providerA: number;
  providerB: number;
  providerC: number;
  markup: number;
};

export default function PricingEngineCapsule({
  providerA,
  providerB,
  providerC,
  markup,
}: PricingEngineCapsuleProps) {
  const lowest = Math.min(providerA, providerB, providerC);
  const finalPrice = lowest + markup;
  return (
    <Card title="Pricing Engine" accent="purple">
      <div style={{fontSize:'0.9rem', color:'#e4e8ff'}}>
        <p>Provider A: ${providerA.toFixed(2)}</p>
        <p>Provider B: ${providerB.toFixed(2)}</p>
        <p>Provider C: ${providerC.toFixed(2)}</p>
        <hr style={{opacity:0.2}} />
        <p>Lowest Source Cost: ${lowest.toFixed(2)}</p>
        <p>Your Markup: ${markup.toFixed(2)}</p>
        <p><strong>Final Customer Price: ${finalPrice.toFixed(2)}</strong></p>
        <p>Profit: ${markup.toFixed(2)} per booking</p>
      </div>
    </Card>
  );
}
