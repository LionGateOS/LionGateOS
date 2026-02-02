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
    <div className="bg-black min-h-screen text-gray-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">SMARTQUOTEAI PRO</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">LIONGATEOS Restoration Protocol</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('dashboard')} 
              className={`px-4 py-2 rounded-md border transition-all ${view === 'dashboard' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-transparent border-gray-800 hover:border-gray-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('capture')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-500 transition-colors"
            >
              AI FIELD CAPTURE
            </button>
          </div>
        </div>

        {view === 'dashboard' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">CLIENT</label>
                    <div className="text-sm font-medium">New Restoration Project</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">LOCATION</label>
                    <div className="text-sm font-medium">Toronto, ON</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th className="p-4 font-semibold">ITEM DESCRIPTION</th>
                      <th className="p-4 font-semibold text-center">BUDGET</th>
                      <th className="p-4 font-semibold text-center">STANDARD</th>
                      <th className="p-4 font-semibold text-center">PREMIUM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-gray-600 italic">
                          No data available. Use AI Camera to scan site.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                          <td className="p-4 font-medium text-white">
                            {item.budget.name.replace(' (Repair)', '')}
                          </td>
                          <td className="p-4 text-center font-mono text-blue-400">
                            ${item.budget.cost.toFixed(2)}
                          </td>
                          <td className="p-4 text-center font-mono text-green-400">
                            ${item.standard.cost.toFixed(2)}
                          </td>
                          <td className="p-4 text-center font-mono text-purple-400">
                            ${item.premium.cost.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-blue-900/10 p-6 rounded-lg border border-blue-900/30">
                <h3 className="text-sm font-bold text-blue-400 uppercase mb-4">Financial Summary</h3>
                <div className="flex justify-between items-end">
                  <span className="text-gray-400">Project Total (Est)</span>
                  <span className="text-2xl font-bold text-white">${calculateTotal()}</span>
                </div>
                <div className="mt-6 pt-6 border-t border-blue-900/20">
                  <button className={`w-full py-3 rounded-md font-bold transition-all ${items.length > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                    GENERATE PROPOSAL
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
            onConfirm={addTieredItems} 
          />
        )}
      </div>
    </div>
  );
}