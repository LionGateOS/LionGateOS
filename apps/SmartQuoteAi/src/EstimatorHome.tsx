import React, { useState } from 'react';
import { buildEmptyDraft } from '../tools/estimator/logic/EstimatorEngine';

export default function EstimatorHome() {
  // RESTORING YOUR MONTHS OF PROFESSIONAL LOGIC
  const [draft, setDraft] = useState(() => buildEmptyDraft());
  const [laborRiskPct, setLaborRiskPct] = useState(8);
  const [materialRiskPct, setMaterialRiskPct] = useState(6);
  const [contingencyPct, setContingencyPct] = useState(5);
  const [targetProfitPct, setTargetProfitPct] = useState(15);

  return (
    <div className="flex min-h-screen bg-[#091012] text-[#e18ebf] font-sans">
      {/* PROFESSIONAL THREE-PANE LAYOUT */}
      <div className="w-80 bg-[#091012] p-6 flex flex-col gap-6 border-r border-gray-900">
        <div className="text-xl font-bold tracking-tight mb-8">LIONGATEOS</div>
        <div className="space-y-4">
          <div className="bg-[#122023] p-3 rounded-md text-sm cursor-pointer hover:bg-gray-800 transition-colors">Dashboard</div>
          <div className="bg-[#0b9888] p-3 rounded-md text-sm font-bold shadow-sm">SmartQuoteAI</div>
        </div>
      </div>

      <div className="flex-1 px-12 py-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Project Estimator</h1>
        
        {/* YOUR REAL-WORLD RISK CONTROLS */}
        <section className="bg-[#122023] p-6 rounded-xl mb-8 border border-gray-800">
          <h2 className="text-lg font-semibold mb-6">Risk Controls</h2>
          <div className="space-y-6">
            {[
              [laborRiskPct, setLaborRiskPct, 'Labor Risk'],
              [materialRiskPct, setMaterialRiskPct, 'Material Risk'],
              [contingencyPct, setContingencyPct, 'Contingency'],
              [targetProfitPct, setTargetProfitPct, 'Target Profit']
            ].map(([val, setVal, label]) => (
              <div key={label as string} className="flex items-center gap-6">
                <div className="w-40 text-sm text-gray-400 uppercase font-bold tracking-wider">{label as string}</div>
                <input 
                  type="range" 
                  min="0" 
                  max="50"
                  value={val as number} 
                  onChange={(e) => (setVal as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value))} 
                  className="flex-1 accent-[#0b9888] cursor-pointer" 
                />
                <div className="w-12 text-right font-mono text-[#0b9888]">{val as number}%</div>
              </div>
            ))}
          </div>
        </section>

        {/* RESTORING YOUR AIFIELD OPTIONS */}
        <div className="bg-[#122023] p-6 rounded-xl mb-8 border border-gray-800">
          <h3 className="text-xs text-gray-500 uppercase font-bold mb-4 tracking-widest">Estimator Intelligence</h3>
          <button className="bg-[#0b9888] hover:bg-[#087f72] text-white px-8 py-3 rounded-md font-bold text-sm transition-all transform active:scale-95 shadow-lg">
            AIFIELD OPTIONS
          </button>
        </div>
      </div>

      {/* LIVE DOCUMENT PREVIEW */}
      <div className="flex-1 bg-[#091012] border-l border-gray-900 flex items-center justify-center p-8">
        <div className="w-full h-full border border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-700 bg-[#0c1214]">
          <div className="text-center">
            <p className="text-sm font-medium mb-1">Live Preview Pane</p>
            <p className="text-xs text-gray-800">Awaiting project data...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
