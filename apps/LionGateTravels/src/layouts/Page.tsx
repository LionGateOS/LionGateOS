
import React from 'react';

type PageProps = {
  children: React.ReactNode;
};

export default function Page({ children }: PageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1020',
        color: '#f5f7ff',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          background: 'rgba(9, 14, 35, 0.96)',
          borderRadius: '18px',
          border: '1px solid rgba(90, 118, 255, 0.45)',
          boxShadow: '0 18px 45px rgba(7, 12, 40, 0.9)',
          padding: '24px 28px 28px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
