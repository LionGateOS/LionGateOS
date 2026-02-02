
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export default function Button({ variant = 'primary', children, style, ...rest }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '0.9rem',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.18s ease-out',
    fontWeight: 500,
    letterSpacing: '0.02em',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  };

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background:
            'radial-gradient(circle at 0 0, #5b8dff 0, #3254ff 38%, #1c2f94 72%, #0c153d 100%)',
          borderColor: 'rgba(119, 154, 255, 0.7)',
          color: '#f8fbff',
          boxShadow: '0 0 0 1px rgba(80, 125, 255, 0.5), 0 10px 25px rgba(11, 28, 90, 0.85)',
        }
      : {
          background: 'rgba(12, 18, 48, 0.8)',
          borderColor: 'rgba(107, 127, 185, 0.7)',
          color: '#d6dcff',
        };

  return (
    <button
      {...rest}
      style={{
        ...baseStyle,
        ...variantStyle,
        ...(style || {}),
      }}
    >
      {children}
    </button>
  );
}
