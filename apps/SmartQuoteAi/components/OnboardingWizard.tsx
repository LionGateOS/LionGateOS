
import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '../types';
import { Button } from './Button';
import { ArrowRight, Building2, Palette, CheckCircle, Globe } from 'lucide-react';
import { THEME_PALETTES, THEME_COLORS_HEX, US_STATES, CA_PROVINCES, US_TAX_RATES, CA_TAX_RATES } from '../constants';

interface Props {
  onComplete: (profile: BusinessProfile) => void;
  initialProfile: BusinessProfile;
}

export const OnboardingWizard: React.FC<Props> = ({ onComplete, initialProfile }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);

  // Instant Theme Preview Logic
  useEffect(() => {
    const theme = profile.theme || 'royal';
    const colors = THEME_PALETTES[theme] || THEME_PALETTES.royal;
    const root = document.documentElement;

    root.style.setProperty('--color-brand-50', colors[0]);
    root.style.setProperty('--color-brand-100', colors[0]);
    root.style.setProperty('--color-brand-200', colors[0]);
    root.style.setProperty('--color-brand-500', colors[1]);
    root.style.setProperty('--color-brand-600', colors[1]);
    root.style.setProperty('--color-brand-700', colors[1]);
    root.style.setProperty('--color-brand-800', colors[2]);
    root.style.setProperty('--color-brand-900', colors[2]);
    root.style.setProperty('--color-brand-950', colors[2]);
  }, [profile.theme]);

  const handleStateChange = (newState: string) => {
    let rate = 0;
    if (profile.country === 'United States' && US_TAX_RATES[newState]) {
      rate = US_TAX_RATES[newState];
    } else if (profile.country === 'Canada' && CA_TAX_RATES[newState]) {
      rate = CA_TAX_RATES[newState];
    }
    setProfile({ ...profile, state: newState, defaultTaxRate: rate });
  };

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i <= step ? 'bg-brand-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 md:p-12 max-h-[90vh] overflow-y-auto">
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mb-6 text-brand-600"><Building2 size={32} /></div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to SmartQuote</h1>
              <p className="text-slate-500 mb-8">Let's get your business set up for success. It only takes a minute.</p>
              
              <div className="space-y-4">
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">Business Name</label><input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-brand-500 outline-none font-bold" placeholder="e.g. Acme Construction" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">Business Email</label><input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-brand-500 outline-none" /></div>
              </div>
              <div className="mt-8 flex justify-end"><Button onClick={next} icon={<ArrowRight size={18}/>}>Next Step</Button></div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600"><Globe size={32} /></div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Where do you operate?</h2>
              <p className="text-slate-500 mb-8">We'll optimize taxes and currency for your location.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Country</label>
                   <select value={profile.country} onChange={e => setProfile({...profile, country: e.target.value, state: ''})} className="w-full p-3 border-2 border-slate-200 rounded-xl">
                     <option>United States</option>
                     <option>Canada</option>
                     <option>United Kingdom</option>
                     <option>Australia</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Currency</label>
                   <select value={profile.currency} onChange={e => setProfile({...profile, currency: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl">
                     <option value="USD">USD ($)</option>
                     <option value="CAD">CAD ($)</option>
                     <option value="GBP">GBP (£)</option>
                     <option value="EUR">EUR (€)</option>
                   </select>
                 </div>
                 {(profile.country === 'United States' || profile.country === 'Canada') && (
                   <div className="md:col-span-2">
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{profile.country === 'Canada' ? 'Province' : 'State'}</label>
                     <select value={profile.state || ''} onChange={e => handleStateChange(e.target.value)} className="w-full p-3 border-2 border-slate-200 rounded-xl">
                        <option value="">Select...</option>
                        {(profile.country === 'Canada' ? CA_PROVINCES : US_STATES).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                     </select>
                     {profile.defaultTaxRate !== undefined && profile.defaultTaxRate > 0 && (
                       <p className="text-xs text-emerald-600 mt-2 font-medium">✔ Detected Tax Rate: {profile.defaultTaxRate}%</p>
                     )}
                   </div>
                 )}
              </div>
              <div className="mt-8 flex justify-between"><Button variant="ghost" onClick={back}>Back</Button><Button onClick={next} icon={<ArrowRight size={18}/>}>Next Step</Button></div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600"><Palette size={32} /></div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose your Brand Look</h2>
              <p className="text-slate-500 mb-8">Select a theme that matches your company identity.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(THEME_COLORS_HEX).map(([key, hexColor]) => (
                  <button key={key} onClick={() => setProfile({...profile, theme: key as any})} className={`p-4 rounded-xl border-2 text-center capitalize transition-all hover:shadow-md flex flex-col items-center gap-3 ${profile.theme === key ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200' : 'border-slate-200'}`}>
                    <div className={`w-12 h-12 rounded-full shadow-sm ${profile.theme === key ? 'scale-110 ring-2 ring-white shadow-md' : ''}`} style={{ backgroundColor: hexColor }} />
                    <span className={`text-sm font-medium ${profile.theme === key ? 'text-brand-700' : 'text-slate-600'}`}>{key}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between"><Button variant="ghost" onClick={back}>Back</Button><Button onClick={next} icon={<ArrowRight size={18}/>}>Next Step</Button></div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-slide-up text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 mx-auto"><CheckCircle size={40} /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">You're All Set!</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">Your business profile is ready. You can now create invoices, estimate jobs with AI, and manage your team.</p>
              <Button size="lg" className="w-full md:w-auto px-12 shadow-xl shadow-brand-500/30" onClick={() => onComplete(profile)}>Launch Dashboard</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
