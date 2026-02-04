import React from 'react';
import { DESTINATIONS } from '../data/Reference_Data';
import { UniversalDestinationTemplate } from '../components/UniversalDestinationTemplate';

export const Destinations = () => {
  return (
    <div style={{ padding: '0 20px 40px' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px', background: 'linear-gradient(to right, var(--lg-accent), var(--lg-accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Global Destinations
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Explore curated decision environments designed for preparation, pacing, and real-world tradeoffs.
        </p>
      </div>
      
      <h2 style={{ marginTop: '30px', borderBottom: '1px solid var(--lg-stroke)', paddingBottom: '10px' }}>Countries</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '20px' }}>
        {DESTINATIONS.filter(d => d.type === 'country').map(dest => (
          <UniversalDestinationTemplate 
            key={dest.id} 
            name={dest.name} 
            type={dest.type as 'country' | 'city'}
            description={dest.description}
            intelligence={{
              hurricaneWarning: dest.id === 'brazil' ? 'Seasonal storms expected in coastal regions.' : undefined,
              culturalWarning: dest.id === 'japan' ? 'High context culture. Silence is communication.' : undefined
            }}
          />
        ))}
      </div>

      <h2 style={{ marginTop: '50px', borderBottom: '1px solid var(--lg-stroke)', paddingBottom: '10px' }}>Cities</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '20px' }}>
        {DESTINATIONS.filter(d => d.type === 'city').map(dest => (
          <UniversalDestinationTemplate 
            key={dest.id} 
            name={dest.name} 
            type={dest.type as 'country' | 'city'}
            description={dest.description}
            intelligence={{
               hurricaneWarning: dest.id === 'tampa-bay' ? 'Hurricane Watch: Category 1 projected path.' : undefined,
               culturalWarning: dest.id === 'dubai' ? 'Respect local dress codes in public spaces.' : undefined
            }}
          />
        ))}
      </div>
    </div>
  );
};
