import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassCard = ({ children, title, subtitle, className = '', style = {} }: GlassCardProps) => {
  return (
    <div 
      className={`lg-card ${className}`}
      style={{
        ...style,
        background: 'rgba(20, 28, 50, var(--lg-glass-alpha))',
        backdropFilter: 'blur(var(--lg-blur))',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'var(--lg-shadow)',
        borderRadius: 'var(--lg-radius)',
        overflow: 'hidden',
        color: 'var(--lg-text)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--lg-shadow)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {(title || subtitle) && (
        <div className="lg-card__head" style={{
          padding: '18px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.0) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {title && <h3 className="lg-card__title" style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h3>}
            {subtitle && <p className="lg-card__subtitle" style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--lg-text-muted)', fontWeight: 500 }}>{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="lg-card__body" style={{ padding: '22px' }}>
        {children}
      </div>
    </div>
  );
};
