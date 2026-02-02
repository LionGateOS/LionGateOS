import React from 'react';
import Page from '../layouts/Page';
import PricingEngineCapsule from '../capsules/PricingEngineCapsule';
import PricingStrategyCapsule from '../capsules/PricingStrategyCapsule';

export default function TripDetailsPage() {
  return (
    <Page>
      <h2>Trip Details + Pricing Intelligence</h2>
      <PricingEngineCapsule
        providerA={280}
        providerB={295}
        providerC={265}
        markup={7}
      />
      <PricingStrategyCapsule
        lowestCost={265}
        competitorA={310}
        competitorB={305}
        competitorC={312}
      />
    </Page>
  );
}
