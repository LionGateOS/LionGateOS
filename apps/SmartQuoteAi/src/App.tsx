import React, { useState, useCallback } from 'react';
import EstimatorHome from '../tools/estimator/ui/EstimatorHome';
import LionGateOrb from './components/LionGateOrb';

export default function App() {
  const [grandTotal, setGrandTotal] = useState(0);

  const handleUpdateTotal = useCallback((newTotal: number) => {
    setGrandTotal(prev => (Math.abs(prev - newTotal) > 0.01 ? newTotal : prev));
  }, []);

  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: '#0a0a0c', 
      display: 'flex', 
      overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative'
    }}>
      
      {/* THEMED ORB */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999 }}>
         <LionGateOrb size={45} initialX="right" initialY="bottom" />
      </div>

      {/* MAIN ESTIMATOR - FORCED PRO MODE */}
      <div style={{ flex: '6', borderRight: '1px solid #222', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 10 }}>
          <EstimatorHome onUpdateTotal={handleUpdateTotal} userPlan='Pro' />
        </div>
      </div>

      {/* INTELLIGENCE PANEL */}
      <div style={{ flex: '4', background: '#0f0f12', padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', borderLeft: '1px solid #1a1a1a' }}>
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '10px' }}>
          <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 5px 0' }}>SmartQuote Intelligence</h2>
          <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>System Online • Pro Analysis Active</p>
        </div>
        
        <div style={{ marginTop: 'auto', padding: '25px', background: '#131316', borderRadius: '16px', border: '1px solid #222' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
             <span style={{ color: '#666' }}>ESTIMATED TOTAL</span>
             <span style={{ color: 'var(--lg-accent, #3b82f6)', fontWeight: 'bold', fontSize: '24px' }}>
               ${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
             </span>
           </div>
           <button style={{
             width: '100%', padding: '15px', borderRadius: '8px', 
             background: 'var(--lg-accent, #3b82f6)', border: 'none', 
             color: '#fff', fontWeight: 'bold', cursor: 'pointer'
           }}>
             GENERATE PRO PROPOSAL
           </button>
        </div>
      </div>
    </div>
  );
}