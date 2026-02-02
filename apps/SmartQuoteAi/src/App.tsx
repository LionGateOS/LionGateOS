import React, { useState } from 'react';
import { MobileCamera } from './MobileCamera';
import { ReviewScreen } from './ReviewScreen';
import { processPhotoEstimate } from './visionProcessor';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [estimates, setEstimates] = useState(null);

  const handlePhoto = async (img: string) => {
    const res = await processPhotoEstimate(img, "CONSTRUCTION");
    setEstimates(res);
    setView('review');
  };

  return (
    <main className="bg-black min-h-screen text-white p-4">
      <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4">
        <button 
          onClick={() => setView('dashboard')} 
          className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-blue-600' : 'bg-gray-800'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setView('capture')} 
          className={`px-4 py-2 rounded ${view === 'capture' ? 'bg-blue-600' : 'bg-gray-800'}`}
        >
          AI Camera
        </button>
      </div>

      {view === 'dashboard' && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">SmartQuoteAI Dashboard</h1>
          <p className="text-gray-400">Your material registry and previous quotes are listed here.</p>
          
          <div className="mt-8 p-6 border border-dashed border-gray-700 rounded-lg text-center">
            <p className="text-gray-500">No recent quotes found. Use the AI Camera to start a new estimate.</p>
          </div>
        </div>
      )}

      {view === 'capture' && <MobileCamera onPhoto={handlePhoto} />}
      
      {view === 'review' && (
        <ReviewScreen 
          estimates={estimates} 
          onConfirm={() => setView('dashboard')} 
        />
      )}
    </main>
  );
}