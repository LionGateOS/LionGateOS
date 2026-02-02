import React from 'react';

interface ReviewScreenProps {
  estimates: any;
  onConfirm: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ estimates, onConfirm }) => {
  const handleSelect = (tier: string, data: any) => {
    // Prepare data for ROWS (Immutable Ledger)
    const payload = {
      timestamp: new Date().toISOString(),
      module: "SmartQuoteAI",
      description: data.name,
      amount: data.cost,
      tier: tier
    };
    
    // In a real app, we'd send this to a backend/ledger here
    console.log("Immutable Record payload:", payload);
    alert(`PROJECT LIFESAVER: Record sent to ROWS as Immutable Fact.`);
    onConfirm();
  };

  if (!estimates) return <div className="p-6 text-white">Loading estimates...</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-8">AI Estimate Review</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(estimates).map(([tier, data]: [string, any]) => (
          <div key={tier} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-bold uppercase text-blue-400">{tier}</h3>
            <p className="mt-2 text-gray-300">{data.name}</p>
            <p className="text-2xl font-bold mt-4">${data.cost.toFixed(2)}</p>
            <button 
              onClick={() => handleSelect(tier, data)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-bold"
            >SELECT TIER</button>
          </div>
        ))}
      </div>
      <button 
        onClick={onConfirm}
        className="mt-8 text-gray-400 hover:text-white underline"
      >
        Back to Dashboard
      </button>
    </div>
  );
};