
import React from 'react';
import Header from './src/layouts/Header';
import { ErrorResponse } from '../../types'; // Import ErrorResponse

interface AppShellProps {
  children: React.ReactNode;
  error?: ErrorResponse; // Optional error prop
}

export default function AppShell({ children, error }: AppShellProps) {
  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      <Header />
      {error && (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', margin: '10px' }}>
          <strong>Error:</strong> {error.message} {error.context ? `(${JSON.stringify(error.context)})` : ''}
        </div>
      )}
      {children}
    </div>
  );
}
