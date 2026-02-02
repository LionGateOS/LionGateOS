import React, { useState } from 'react';
import { MobileCamera } from './MobileCamera';
import { ReviewScreen } from './ReviewScreen';
import { processPhotoEstimate } from './visionProcessor';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [estimates, setEstimates] = useState<any>(null);

  const handlePhoto = async (img: string) => {
    const res = await processPhotoEstimate(img, "CONSTRUCTION");
    setEstimates(res);
    setView('review');
  };

  return (
    <div className="bg-black min-h-screen text-white p-8 font-sans">
      {/* Header Section */}
      <div className="flex justify-between border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SMARTQUOTEAI</h1>
          <p className="text-gray-500 mt-2">LIONGATEOS Restoration Engine</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('dashboard')} 
            className={`px-6 py-2 rounded-md transition-colors ${view === 'dashboard' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setView('capture')} 
            className={`px-6 py-2 rounded-md transition-colors ${view === 'capture' ? 'bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            AIFIELD CAPTURE
          </button>
        </div>
      </div>

      {view === 'dashboard' && (
        <div className="mt-12 grid grid-cols-12 items-start gap-8">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-xl font-semibold mb-4">Project Line Items</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-8 text-center text-gray-500">
                No items added. Use AIFIELD CAPTURE to generate line items from photos.
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 bg-gray-900 p-8 rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold mb-4">Estimate Summary</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span>Budget Total</span>
                <span className="text-white font-mono">$0.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span>Premium Total</span>
                <span className="text-white font-mono">$0.00</span>
              </div>
              <div className="pt-4">
                <button className="w-full py-3 bg-gray-800 rounded-md text-gray-400 cursor-not-allowed">
                  Finalize Quote
                </button>
              </div>
            </div>
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
    </div>
  );
}