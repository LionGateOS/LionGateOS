
import React from 'react';
import Header from './src/layouts/Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      <Header />
      {children}
    </div>
  );
}
