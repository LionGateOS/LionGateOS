import React, { useState } from 'react';
import { Check, X, Zap, CreditCard, Shield } from 'lucide-react';
import { Button } from './Button';
import { PricingConfig } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (cycle: 'monthly' | 'yearly') => void;
  onBuyCredits: (amount: number, price: number) => void;
  pricing: PricingConfig;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  onBuyCredits,
  pricing
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row overflow-hidden border border-slate-800 animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors shadow-sm"
        >
          <X className="text-slate-500" size={20} />
        </button>

        {/* Left Side: Subscription Plans */}
        <div className="w-full md:w-2/3 p-8 md:p-12 border-r border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand-900 mb-3">Upgrade to Pro</h2>
            <p className="text-slate-500 text-base">Unlock advanced AI models, unlimited estimates, and premium features.</p>
            
            {/* Toggle */}
            <div className="flex items-center justify-center mt-8 gap-4 bg-slate-100 p-1.5 rounded-full w-fit mx-auto">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Yearly <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Free Plan */}
            <div className="border border-slate-200 rounded-2xl p-8 flex flex-col hover:border-slate-300 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Starter</h3>
                <p className="text-4xl font-extrabold text-slate-900 mt-3">$0</p>
                <p className="text-sm text-slate-500 font-medium mt-1">Forever free</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="bg-slate-100 p-1 rounded-full"><Check size={14} className="text-slate-600" /></div>
                  <span>3 AI Estimates per month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="bg-slate-100 p-1 rounded-full"><Check size={14} className="text-slate-600" /></div>
                  <span>Standard Estimator Model</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                   <div className="bg-slate-100 p-1 rounded-full"><Check size={14} className="text-slate-600" /></div>
                  <span>Basic PDF Exports</span>
                </li>
              </ul>
              <Button variant="outline" disabled className="w-full rounded-xl">Current Plan</Button>
            </div>

            {/* Pro Plan */}
            <div className="relative border-2 border-gold-400 rounded-2xl p-8 flex flex-col bg-gradient-to-b from-gold-50/50 to-white shadow-2xl shadow-gold-500/20 transform scale-105 z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-brand-800 flex items-center gap-2">
                  <Zap size={20} className="fill-brand-600 text-brand-600" /> Professional
                </h3>
                <p className="text-4xl font-extrabold text-slate-900 mt-3">
                  ${billingCycle === 'monthly' ? pricing.monthlyPro : Math.round(pricing.yearlyPro / 12)}
                  <span className="text-sm font-bold text-slate-500">/mo</span>
                </p>
                {billingCycle === 'yearly' && <p className="text-xs text-green-600 font-bold mt-1">Billed ${pricing.yearlyPro} yearly</p>}
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-800 font-semibold">
                   <div className="bg-gold-100 p-1 rounded-full"><Check size={14} className="text-gold-600" /></div>
                  <span>Unlimited AI Estimates</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-800 font-semibold">
                   <div className="bg-gold-100 p-1 rounded-full"><Check size={14} className="text-gold-600" /></div>
                  <span>Premium AI Models (Pro 1.5)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-800 font-semibold">
                   <div className="bg-gold-100 p-1 rounded-full"><Check size={14} className="text-gold-600" /></div>
                  <span>Photo Analysis & Takeoffs</span>
                </li>
                 <li className="flex items-start gap-3 text-sm text-slate-800 font-semibold">
                   <div className="bg-gold-100 p-1 rounded-full"><Check size={14} className="text-gold-600" /></div>
                  <span>24/7 AI App Assistant</span>
                </li>
              </ul>
              <Button onClick={() => onSubscribe(billingCycle)} variant="premium" className="w-full rounded-xl shadow-xl shadow-gold-500/30 py-3 text-base">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Credit Packs */}
        <div className="w-full md:w-1/3 bg-slate-50 p-8 md:p-12 flex flex-col border-t md:border-t-0 md:border-l border-slate-200">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CreditCard size={24} className="text-slate-700" /> Buy Credits
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">Not ready to subscribe? Purchase credit packs for on-demand estimates.</p>
          </div>

          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all cursor-pointer group" onClick={() => onBuyCredits(pricing.creditPackSmall.credits, pricing.creditPackSmall.price)}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-900 text-lg">{pricing.creditPackSmall.credits} Credits</span>
                <span className="font-bold text-brand-600 text-lg">${pricing.creditPackSmall.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-brand-600 transition-colors font-medium">Great for small projects.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-green-400 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden" onClick={() => onBuyCredits(pricing.creditPackMedium.credits, pricing.creditPackMedium.price)}>
               <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                BEST VALUE
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-900 text-lg">{pricing.creditPackMedium.credits} Credits</span>
                <span className="font-bold text-brand-600 text-lg">${pricing.creditPackMedium.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-brand-600 transition-colors font-medium">Most popular choice.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all cursor-pointer group" onClick={() => onBuyCredits(pricing.creditPackLarge.credits, pricing.creditPackLarge.price)}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-900 text-lg">{pricing.creditPackLarge.credits} Credits</span>
                <span className="font-bold text-brand-600 text-lg">${pricing.creditPackLarge.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-brand-600 transition-colors font-medium">For serious contractors.</p>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center font-medium bg-slate-100 py-3 rounded-lg">
              <Shield size={14} />
              <span>Secure Payment Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};