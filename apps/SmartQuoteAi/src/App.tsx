import React, { useState } from 'react';
import { MobileCamera } from './MobileCamera';
import { ReviewScreen } from './ReviewScreen';
import { processPhotoEstimate } from './visionProcessor';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [items, setItems] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any>(null);

  const handlePhoto = async (img: string) => {
    const res = await processPhotoEstimate(img, "CONSTRUCTION");
    setEstimates(res);
    setView('review');
  };

  const addTieredItems = () => {
    if (estimates) {
      setItems([...items, estimates]);
      setView('dashboard');
      setEstimates(null);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8 font-sans">
      {/* Professional Header */}
      <div className="flex justify-between border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold">SMARTQUOTEAI</h1>
          <p className="text-gray-500">LIONGATEOS Intelligence</p>
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
        <div className="mt-8 overflow-x-auto">
          <table className="w-full bg-gray-900 rounded-xl overflow-hidden border-collapse">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="p-4 border-b border-gray-700">DESCRIPTION</th>
                <th className="p-4 border-b border-gray-700">BUDGET</th>
                <th className="p-4 border-b border-gray-700">STANDARD</th>
                <th className="p-4 border-b border-gray-700">PREMIUM</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                    No items added. Use AIFIELD CAPTURE to generate line items from photos.
                  </td>
                </tr>
              ) : (
                items.map((item, i) => (
                  <tr key={i} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">{item.budget.name.replace(' (Repair)', '')}</td>
                    <td className="p-4 font-mono text-blue-400">${item.budget.cost.toFixed(2)}</td>
                    <td className="p-4 font-mono text-green-400">${item.standard.cost.toFixed(2)}</td>
                    <td className="p-4 font-mono text-purple-400">${item.premium.cost.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === 'capture' && <MobileCamera onPhoto={handlePhoto} />}
      
      {view === 'review' && (
        <ReviewScreen 
          estimates={estimates} 
          onConfirm={addTieredItems} 
        />
      )}
    </div>
  );
}