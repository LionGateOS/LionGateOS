import React, { useState } from 'react';
import { PlatformAnalytics, AIProviderConfig, UserRecord, PricingConfig } from '../types';
import { Button } from './Button';
import { DollarSign, Server, Users, AlertTriangle, CreditCard, Lock, FileText, Settings, Trash2, Ban, RefreshCcw, Save } from 'lucide-react';

interface AdminProps {
  stats: PlatformAnalytics;
  onUpdateProvider: (config: AIProviderConfig) => void;
  pricing: PricingConfig;
  onUpdatePricing: (config: PricingConfig) => void;
}

export const AdminDashboard: React.FC<AdminProps> = ({ stats, onUpdateProvider, pricing, onUpdatePricing }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'pricing' | 'users' | 'settings'>('overview');
  const [localPricing, setLocalPricing] = useState<PricingConfig>(pricing);
  const [apiKey, setApiKey] = useState('');

  const handleSavePricing = () => {
    onUpdatePricing(localPricing);
    alert("Pricing updated successfully");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Platform Admin</h2>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          <button onClick={() => setActiveSection('overview')} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeSection === 'overview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Overview</button>
          <button onClick={() => setActiveSection('pricing')} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeSection === 'pricing' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Pricing</button>
          <button onClick={() => setActiveSection('settings')} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeSection === 'settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Settings</button>
        </div>
      </div>

      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <div className="text-xs font-bold text-slate-400 uppercase">Total Revenue</div>
                 <DollarSign className="text-emerald-500" size={20}/>
              </div>
              <div className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <div className="text-xs font-bold text-slate-400 uppercase">Active Subs</div>
                 <Users className="text-blue-500" size={20}/>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.activeSubscribers}</div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <div className="text-xs font-bold text-slate-400 uppercase">API Costs</div>
                 <Server className="text-orange-500" size={20}/>
              </div>
              <div className="text-3xl font-bold text-slate-900">${stats.totalApiCosts.toFixed(2)}</div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <div className="text-xs font-bold text-slate-400 uppercase">Net Profit</div>
                 <CreditCard className="text-purple-500" size={20}/>
              </div>
              <div className="text-3xl font-bold text-slate-900">${stats.netProfit.toLocaleString()}</div>
           </div>
        </div>
      )}

      {activeSection === 'pricing' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Subscription & Credit Pricing</h3>
            <Button size="sm" icon={<Save size={16}/>} onClick={handleSavePricing}>Save Changes</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase text-slate-500 border-b pb-2">Pro Plan (Recurring)</h4>
                <div>
                   <label className="block text-xs font-bold mb-1 text-slate-900">Monthly Price ($)</label>
                   <input type="number" value={localPricing.monthlyPro} onChange={e => setLocalPricing({...localPricing, monthlyPro: parseFloat(e.target.value)})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                </div>
                <div>
                   <label className="block text-xs font-bold mb-1 text-slate-900">Yearly Price ($)</label>
                   <input type="number" value={localPricing.yearlyPro} onChange={e => setLocalPricing({...localPricing, yearlyPro: parseFloat(e.target.value)})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase text-slate-500 border-b pb-2">Credit Packs (One-time)</h4>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="block text-xs font-bold mb-1 text-slate-900">Small Pack (Credits)</label>
                      <input type="number" value={localPricing.creditPackSmall.credits} onChange={e => setLocalPricing({...localPricing, creditPackSmall: {...localPricing.creditPackSmall, credits: parseInt(e.target.value)}})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold mb-1 text-slate-900">Price ($)</label>
                      <input type="number" value={localPricing.creditPackSmall.price} onChange={e => setLocalPricing({...localPricing, creditPackSmall: {...localPricing.creditPackSmall, price: parseFloat(e.target.value)}})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="block text-xs font-bold mb-1 text-slate-900">Medium Pack (Credits)</label>
                      <input type="number" value={localPricing.creditPackMedium.credits} onChange={e => setLocalPricing({...localPricing, creditPackMedium: {...localPricing.creditPackMedium, credits: parseInt(e.target.value)}})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold mb-1 text-slate-900">Price ($)</label>
                      <input type="number" value={localPricing.creditPackMedium.price} onChange={e => setLocalPricing({...localPricing, creditPackMedium: {...localPricing.creditPackMedium, price: parseFloat(e.target.value)}})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="block text-xs font-bold mb-1 text-slate-900">Large Pack (Credits)</label>
                      <input type="number" value={localPricing.creditPackLarge.credits} onChange={e => setLocalPricing({...localPricing, creditPackLarge: {...localPricing.creditPackLarge, credits: parseInt(e.target.value)}})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold mb-1 text-slate-900">Price ($)</label>
                      <input type="number" value={localPricing.creditPackLarge.price} onChange={e => setLocalPricing({...localPricing, creditPackLarge: {...localPricing.creditPackLarge, price: parseFloat(e.target.value)}})} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-xl font-bold text-slate-900 mb-6">System Configuration</h3>
           <div className="max-w-md space-y-4">
              <div>
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">AI Provider</label>
                 <select className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" disabled>
                    <option>Google Gemini (Active)</option>
                    <option>OpenAI GPT-4</option>
                    <option>Anthropic Claude</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">API Key</label>
                 <div className="flex gap-2">
                    <input type="password" value="************************" disabled className="flex-1 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-400" />
                    <Button size="sm" variant="outline" onClick={() => alert("Key rotation requires super-admin access")}>Rotate</Button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};