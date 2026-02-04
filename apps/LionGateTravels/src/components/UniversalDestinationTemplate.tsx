import React from 'react';
import { GlassCard } from './GlassCard';

interface DecisionIntelligenceProps {
  hurricaneWarning?: string;
  culturalWarning?: string;
}

interface UniversalDestinationTemplateProps {
  name: string;
  description: string;
  type: 'country' | 'city';
  intelligence: DecisionIntelligenceProps;
}

export const UniversalDestinationTemplate = ({ name, description, type, intelligence }: UniversalDestinationTemplateProps) => {
  return (
    <div className="lg-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      padding: '20px'
    }}>
      {/* Hero / Main Info */}
      <GlassCard title={name} subtitle={type.toUpperCase()}>
        <p style={{ lineHeight: 1.6, fontSize: '15px' }}>{description}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button className="lg-btn lg-btn--primary">View Details</button>
          <button className="lg-btn">Save to Trip</button>
        </div>
      </GlassCard>

      {/* Decision Intelligence Slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Hurricane Warning Slot */}
        <GlassCard title="⚠ Hurricane Warning" style={{ 
          borderColor: intelligence.hurricaneWarning ? 'rgba(248,113,113,0.4)' : 'var(--lg-stroke)' 
        }}>
          {intelligence.hurricaneWarning ? (
            <div style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span>🌪</span>
               <span>{intelligence.hurricaneWarning}</span>
            </div>
          ) : (
            <p style={{ color: 'var(--lg-text-muted)', fontSize: '14px' }}>No active hurricane threats detected for this region.</p>
          )}
        </GlassCard>

        {/* Cultural Warning Slot */}
        <GlassCard title="🧠 Cultural Intelligence">
          {intelligence.culturalWarning ? (
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>{intelligence.culturalWarning}</p>
            </div>
          ) : (
             <p style={{ color: 'var(--lg-text-muted)', fontSize: '14px' }}>Standard cultural norms apply. No specific warnings.</p>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
