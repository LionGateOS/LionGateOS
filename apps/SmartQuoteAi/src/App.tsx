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

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.standard.cost, 0).toFixed(2);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] text-[#21252a] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#21252a] text-white p-6 flex flex-col gap-8 shadow-2xl">
        <div className="text-2xl font-bold tracking-tight">LIONGATEOS</div>
        <nav className="flex flex-col gap-4 text-sm">
          <button 
            onClick={() => setView('dashboard')} 
            className={`p-3 rounded-md text-left transition-colors ${view === 'dashboard' ? 'bg-[#0b9888] text-white font-semibold' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setView('capture')} 
            className={`p-3 rounded-md text-left transition-colors ${view === 'capture' ? 'bg-[#0b9888] text-white font-semibold' : 'text-[#0b9888] font-semibold hover:bg-gray-800'}`}
          >
            SmartQuoteAI
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-800 text-[10px] text-gray-500 uppercase tracking-widest text-center">
          Intelligence Module v2.0
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Project Estimator</h1>
            <button 
              onClick={() => setView('capture')} 
              className="bg-[#0b9888] hover:bg-[#097a7a] text-white px-6 py-2 rounded-md shadow-sm font-semibold transition-all transform hover:scale-105"
            >
              AIFIELD OPTIONS
            </button>
          </div>

          {view === 'dashboard' && (
            <div className="relative bg-white p-8 rounded-xl border border-[#e0e4e7] shadow-sm overflow-hidden">
              {/* AI Motion Effect Layer */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0b9888] to-transparent animate-pulse"></div>
              
              <h3 className="text-xs text-gray-400 uppercase font-bold mb-6 tracking-wider">Active Estimate</h3>
              
              {items.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  <div className="mb-4 text-4xl">📸</div>
                  No data present. Use AI Capture to begin processing.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-gray-400 border-b border-gray-100">
                        <tr>
                          <th className="pb-4 font-semibold">DESCRIPTION</th>
                          <th className="pb-4 font-semibold text-center">BUDGET</th>
                          <th className="pb-4 font-semibold text-center">STANDARD</th>
                          <th className="pb-4 font-semibold text-center">PREMIUM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {items.map((item, i) => (
                          <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 font-medium text-[#21252a]">
                              {item.budget.name.replace(' (Repair)', '')}
                            </td>
                            <td className="py-4 text-center font-mono text-blue-600">
                              ${item.budget.cost.toFixed(2)}
                            </td>
                            <td className="py-4 text-center font-mono text-[#0b9888]">
                              ${item.standard.cost.toFixed(2)}
                            </td>
                            <td className="py-4 text-center font-mono text-purple-600">
                              ${item.premium.cost.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500 uppercase">Project Total (Standard)</span>
                    <span className="text-2xl font-bold text-[#0b9888]">${calculateTotal()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'capture' && (
            <div className="max-w-2xl mx-auto">
              <MobileCamera onPhoto={handlePhoto} />
            </div>
          )}
          
          {view === 'review' && (
            <ReviewScreen 
              estimates={estimates} 
              onConfirm={addTieredItems} 
            />
          )}
        </div>
      </div>
    </div>
  );
}