import React from 'react';
import Card from '../components/Card';

type PricingStrategyCapsuleProps = {
  lowestCost: number;
  competitorA: number;
  competitorB: number;
  competitorC: number;
};

export default function PricingStrategyCapsule({
  lowestCost,
  competitorA,
  competitorB,
  competitorC,
}: PricingStrategyCapsuleProps) {
  const competitors = [competitorA, competitorB, competitorC];
  const lowestCompetitor = Math.min(...competitors);

  // Simple smart markup logic: aim to be $5 cheaper than the lowest competitor
  const targetPrice = lowestCompetitor - 5;
  const markup = targetPrice - lowestCost;
  const finalPrice = lowestCost + markup;

  return (
    <Card title="Pricing Strategy AI" accent="blue">
      <div style={{ fontSize: '0.9rem', color: '#e4e8ff' }}>
        <p>Lowest Provider Cost: ${lowestCost.toFixed(2)}</p>
        <p>Competitor A: ${competitorA.toFixed(2)}</p>
        <p>Competitor B: ${competitorB.toFixed(2)}</p>
        <p>Competitor C: ${competitorC.toFixed(2)}</p>
        <hr style={{ opacity: 0.2 }} />
        <p>Lowest Competitor Price: ${lowestCompetitor.toFixed(2)}</p>
        <p>Recommended Customer Price: ${finalPrice.toFixed(2)}</p>
        <p>Your Profit: ${markup.toFixed(2)} per booking</p>
      </div>
    </Card>
  );
}
