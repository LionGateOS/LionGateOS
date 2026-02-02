
import React from 'react';

type CardProps = {
  children: React.ReactNode;
  title?: string;
  accent?: 'blue' | 'teal' | 'purple';
};

export default function Card({ children, title, accent = 'blue' }: CardProps) {
  const accentColorMap: Record<string, string> = {
    blue: 'rgba(92, 140, 255, 0.7)',
    teal: 'rgba(63, 201, 199, 0.7)',
    purple: 'rgba(189, 140, 255, 0.7)',
  };

  const accentColor = accentColorMap[accent] || accentColorMap.blue;

  return (
    <section
      style={{
        background: 'radial-gradient(circle at 0 0, rgba(76, 115, 255, 0.08), rgba(5, 9, 30, 0.95))',
        borderRadius: '16px',
        border: `1px solid ${accentColor}`,
        boxShadow: '0 14px 35px rgba(2, 6, 23, 0.85)',
        padding: '16px 18px 18px',
      }}
    >
      {title && (
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '12px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#aebdff',
            }}
          >
            {title}
          </h3>
        </header>
      )}
      <div style={{ fontSize: '0.94rem', color: '#e4e8ff' }}>{children}</div>
    </section>
  );
}
