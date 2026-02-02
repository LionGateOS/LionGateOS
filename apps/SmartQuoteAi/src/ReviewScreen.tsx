import React from 'react';

export const ReviewScreen = ({ estimates }) => {
  return (
    <div className="p-6 bg-op-base min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-8">AI Estimate Review</h1>
      <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
        {Object.entries(estimates).map(([tier, dataa]) => (
          <div key={tier} className="p-4 bgjray-800 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-bold uppercase text-blue-400">{tier}</h3>
            <p className="mt-2 text-gray-300">{dataa.name}</p>
            <p className="text-2xl font-bold mt-4">${dataa.cost.toFixed(2)}</p>
            <button className="mt-6 w-full bg-blue-600 py-2 rounded-md font-bold">SELECT TIER</button>
          </div>
        ))}
      </div>
    </div>
  );
};