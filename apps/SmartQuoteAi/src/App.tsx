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
    <div className="bg-[#f4f7f6] min-h-screen text-gray-800 font-sans">
      {/* Visual Authority Header */}
      <div className="bg-white border-b border-[#e0e4e7] p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0b9888] rounded-md flex items-center justify-center text-white font-bold">LP</div>
            <h1 className="text-xl font-bold text-[#21252a]">SMARTQUOTEAI</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('dashboard')} 
              className={`px-4 py-2 text-sm rounded-md transition-colors ${view === 'dashboard' ? 'bg-[#f4f7f6] font-semibold' : 'hover:bg-gray-50'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('capture')} 
              className="px-4 py-2 text-sm bg-[#0b9888] text-white rounded-md font-semibold hover:bg-[#097a7a] transition-colors"
            >
              AIFIELD OPTIONS
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {view === 'dashboard' && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              {/* Project Details Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e0e4e7] mb-6">
                <h3 className="text-sm font-bold text-[#0b9888] uppercase mb-4 tracking-wider">Project Details</h3>
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-semibold">Client</label>
                    <div className="font-medium text-[#21252a]">New Restoration Project</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-semibold">Location</label>
                    <div className="font-medium text-[#21252a]">Toronto, ON</div>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e4e7] overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f8f9fa] text-gray-600 border-b border-[#e0e4e7]">
                    <tr>
                      <th className="p-4 font-semibold">DESCRIPTION</th>
                      <th className="p-4 font-semibold text-center">BUDGET</th>
                      <th className="p-4 font-semibold text-center">STANDARD</th>
                      <th className="p-4 font-semibold text-center">PREMIUM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e4e7]">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-gray-400 italic">
                          Awaiting AIFIELD CAPTURE data...
                        </td>
                      </tr>
                    ) : (
                      items.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-[#21252a]">
                            {item.budget.name.replace(' (Repair)', '')}
                          </td>
                          <td className="p-4 text-center font-mono text-blue-600">
                            ${item.budget.cost.toFixed(2)}
                          </td>
                          <td className="p-4 text-center font-mono text-[#0b9888]">
                            ${item.standard.cost.toFixed(2)}
                          </td>
                          <td className="p-4 text-center font-mono text-purple-600">
                            ${item.premium.cost.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e0e4e7]">
                <h3 className="text-sm font-bold text-[#0b9888] uppercase mb-6 tracking-wider">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Subtotal (Standard)</span>
                    <span className="font-mono text-[#21252a]">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Tax (Estimated)</span>
                    <span className="font-mono text-[#21252a]">$0.00</span>
                  </div>
                  <div className="pt-4 border-t border-[#e0e4e7] flex justify-between items-center">
                    <span className="font-bold text-[#21252a]">Total Estimate</span>
                    <span className="text-xl font-bold text-[#0b9888]">${calculateTotal()}</span>
                  </div>
                  <button className={`w-full mt-6 py-3 rounded-md font-bold transition-all ${items.length > 0 ? 'bg-[#0b9888] hover:bg-[#097a7a] text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    GENERATE PROPOSAL
                  </button>
                </div>
              </div>
            </div>
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
  );
}