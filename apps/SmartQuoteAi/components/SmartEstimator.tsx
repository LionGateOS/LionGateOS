
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Calculator, Info, CheckCircle2, Package, Hammer, Tag, Camera, X, Image as ImageIcon, Lock, Zap, Globe, HardHat, ChevronRight, Briefcase, ArrowRight, Crown, ShoppingBag, Store, Mic, MicOff, FileWarning, Wrench, Droplets, PaintBucket, TreeDeciduous, ChevronDown, ExternalLink, Edit2, Save, Clock, Truck, FileCheck, PlusCircle, Loader2 } from 'lucide-react';
import { analyzeJobEstimate, generateChangeOrder } from '../services/geminiService';
import { ProjectEstimate, ItemState } from '../types';
import { Button } from './Button';
import { compressImage } from '../utils';
import { INDUSTRIES } from '../constants';
import { STARTER_PRESET_LIBRARY } from '../core/presets';
import { PresetSidebar } from './PresetSidebar';
import { v4 as uuidv4 } from 'uuid';

interface SmartEstimatorProps {
  onAddToInvoice: (data: { 
    items: { description: string, quantity: number, unitPrice: number, unit: string }[], 
    photo?: string,
    saveToGallery?: boolean // NEW: Option to save to gallery
  }) => void;
  onSaveEstimate?: (estimate: ProjectEstimate) => void;
  existingEstimate?: ProjectEstimate | null; // NEW: Accept a saved estimate to reload
  availableCredits: number;
  userPlan: 'free' | 'pro' | 'enterprise';
  onUpgrade: () => void;
  onConsumeCredit: (amount: number) => void;
  onRecordUsage: (cost: number) => void;
  context: {
    country: string;
    currency: string;
    locale: string;
    state?: string;
  };
}

type Mode = 'estimate' | 'change_order';

export const SmartEstimator: React.FC<SmartEstimatorProps> = ({ 
  onAddToInvoice, onSaveEstimate, existingEstimate, availableCredits, userPlan, onUpgrade, onConsumeCredit, onRecordUsage, context
}) => {
  // Workflow State
  const [step, setStep] = useState<'trade' | 'scope' | 'results'>('trade');
  const [mode, setMode] = useState<Mode>('estimate');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  
  // Detail Level Toggle
  const [detailLevel, setDetailLevel] = useState<'simple' | 'detailed'>('detailed');

  const [estimateTitle, setEstimateTitle] = useState(''); // NEW: Name of the estimate
  const [projectDescription, setProjectDescription] = useState('');
  const [changeOrderScope, setChangeOrderScope] = useState({ original: '', new: '' });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [saveToGallery, setSaveToGallery] = useState(true); // NEW: Default to true
  
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProjectEstimate | null>(null);
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [itemsState, setItemsState] = useState<Record<number, ItemState>>({});
  const [buttonState, setButtonState] = useState<'idle' | 'success'>('idle');

  // --- HYDRATION LOGIC ---
  // If an existing estimate is passed, load it immediately
  useEffect(() => {
    if (existingEstimate) {
      setResult(existingEstimate);
      setEstimateTitle(existingEstimate.title || 'New Estimate');
      setStep('results');
      // Restore selections if they exist, otherwise default to standard
      if (existingEstimate.savedSelections) {
        setItemsState(existingEstimate.savedSelections);
      } else {
        const iState: any = {};
        existingEstimate.items.forEach((item, idx) => {
            iState[idx] = { 
                isSelected: true, 
                selectedTier: 'standard', 
                discountPercent: 0,
                overrideQuantity: item.quantity,
                overridePrice: item.tiers.standard.unitPrice
            };
        });
        setItemsState(iState);
      }
    } else {
      // Reset if null passed (user clicked "Create New")
      if (step === 'results' && !result) {
         resetFlow();
      }
    }
  }, [existingEstimate]);

  // Update the persisted estimate whenever user changes selection state (qty/tier)
  useEffect(() => {
     if (result && onSaveEstimate && Object.keys(itemsState).length > 0) {
         // We handle saving explicitly via buttons to avoid spamming context updates
     }
  }, [itemsState, result]);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please try using Google Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.error("Speech error", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone permission denied. Please allow access in your browser settings.");
        } else if (event.error === 'no-speech') {
          alert("No speech detected. Please try again closer to the microphone.");
        }
      };

      recognition.onresult = (event: any) => {
         const transcript = event.results[0][0].transcript;
         setProjectDescription(prev => {
            const spacer = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
            return prev + spacer + transcript;
         });
      };
      
      recognition.start();
    } catch (error) {
      console.error("Voice input initialization failed", error);
      alert("Could not initialize voice input.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file);
        setSelectedImage(compressed);
        setError(null);
      } catch (err) {
        console.error("Image processing failed", err);
        setError("Failed to process image. Please try a different photo.");
      } finally {
        setIsProcessingImage(false);
      }
    }
    // Reset input value so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const msgs = [
      "Analyzing project dimensions & scope...",
      "Calculating material quantities + waste (10-15%)...",
      "Estimating labor hours per task...",
      `Checking local pricing in ${context.state || context.country}...`,
      "Generating Budget, Standard, & Premium options..."
    ];
    let msgIdx = 0;
    setLoadingMsg(msgs[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % msgs.length;
      setLoadingMsg(msgs[msgIdx]);
    }, 2500);
    
    try {
      if (mode === 'estimate') {
         const data = await analyzeJobEstimate(projectDescription, selectedImage || undefined, { country: context.country, currency: context.currency, state: context.state }, selectedTrade || 'General');
         if (data) {
            // Add IDs and Metadata
            const enrichedData: ProjectEstimate = {
                ...data,
                id: uuidv4(),
                title: estimateTitle || `${selectedTrade || 'General'} Estimate`,
                timestamp: new Date().toISOString(),
                savedSelections: {} // Will be populated
            };

            setResult(enrichedData);
            
            const iState: any = {};
            data.items.forEach((item, idx) => {
                iState[idx] = { 
                    isSelected: true, 
                    selectedTier: 'standard', 
                    discountPercent: 0,
                    overrideQuantity: item.quantity,
                    overridePrice: item.tiers.standard.unitPrice
                };
            });
            setItemsState(iState);
            
            // Save immediately so it's in history
            if (onSaveEstimate) {
                onSaveEstimate({ ...enrichedData, savedSelections: iState });
            }

            setStep('results');
            onConsumeCredit(1);
         } else {
            setError("Could not generate estimate. Please try again with more detail.");
         }
      } else {
         // Change Order Mode
         const co = await generateChangeOrder(changeOrderScope.original, changeOrderScope.new);
         onAddToInvoice({ 
            items: [{ description: `CHANGE ORDER: ${co.title} - ${co.justification}`, quantity: 1, unitPrice: 0, unit: 'lump sum' }]
         });
         alert("Change Order Draft Added to Invoice");
         resetFlow();
      }
    } catch (err) { 
      console.error(err);
      setError("Error generating estimate. Please try again."); 
    }
    finally { 
      clearInterval(interval);
      setLoading(false); 
    }
  };

  const handleManualSave = () => {
      if (result && onSaveEstimate) {
          onSaveEstimate({ ...result, title: estimateTitle, savedSelections: itemsState });
          alert("Estimate Progress Saved");
      }
  };

  const handleAddSelected = () => {
    if (!result) return;
    
    // 1. Save current state first
    if (onSaveEstimate) {
        onSaveEstimate({ ...result, title: estimateTitle, savedSelections: itemsState });
    }

    // 2. Collect items to add
    const itemsToAdd: { description: string, quantity: number, unitPrice: number, unit: string }[] = [];

    // ADD HEADER ITEM FOR VISUAL SEPARATION
    if (estimateTitle) {
        itemsToAdd.push({ 
            description: `--- ESTIMATE: ${estimateTitle.toUpperCase()} ---`, 
            quantity: 0, 
            unitPrice: 0, 
            unit: '' 
        });
    }

    Object.keys(itemsState).forEach((idxStr) => {
      const idx = parseInt(idxStr);
      const state = itemsState[idx];
      // Safety check if item exists
      if (state.isSelected && result.items[idx]) {
        const item = result.items[idx];
        const tierData = item.tiers[state.selectedTier];
        
        // Safety check if tier data exists
        if (!tierData) return;

        // Use overrides if user edited them in the UI
        const finalQty = state.overrideQuantity !== undefined ? state.overrideQuantity : item.quantity;
        const basePrice = state.overridePrice !== undefined ? state.overridePrice : (tierData.unitPrice || 0);
        const discountedPrice = basePrice * (1 - (state.discountPercent / 100));
        
        // Build comprehensive description based on Detail Level
        let description = item.name;
        
        if (detailLevel === 'detailed') {
            // Add Category Prefix for clarity on invoice if needed
            if (item.category === 'Labor') description = `Labor: ${description}`;

            description += ` (${state.selectedTier.toUpperCase()})`;
            
            if (tierData.description) {
                description += `\n• ${tierData.description}`;
            }
            
            if (tierData.products && tierData.products.length > 0) {
               const prod = tierData.products[0];
               description += `\n• Rec: ${prod.name} (${prod.vendor})`;
            }
            
            if (item.reasoning) {
              description += `\n• Note: ${item.reasoning}`; 
            }
        } else {
            // Simple Mode: Just the name, maybe tier info
            description = `${item.name} - ${state.selectedTier.charAt(0).toUpperCase() + state.selectedTier.slice(1)} Grade`;
        }

        itemsToAdd.push({ description, quantity: finalQty, unitPrice: discountedPrice, unit: item.unit });
      }
    });
    
    // 3. Add all items and photo at once
    if (itemsToAdd.length > 0 || selectedImage) {
      console.log(`Adding ${itemsToAdd.length} items and ${selectedImage ? '1 photo' : '0 photos'} to invoice.`);
      onAddToInvoice({
        items: itemsToAdd,
        photo: selectedImage || undefined,
        saveToGallery: selectedImage ? saveToGallery : false
      });
      
      // Visual Feedback
      setButtonState('success');
      setTimeout(() => setButtonState('idle'), 2000);
    } else {
        alert("No items selected.");
    }
  };

  const resetFlow = () => { 
      setStep('trade'); 
      setResult(null); 
      setProjectDescription(''); 
      setEstimateTitle('');
      setSelectedImage(null); 
      setError(null); 
      setItemsState({});
      setButtonState('idle');
      setSaveToGallery(true);
  };

  const getIndustryIcon = (name: string) => {
     switch(name) {
        case "General Construction": return <Hammer size={20}/>;
        case "Electrical": return <Zap size={20}/>;
        case "Plumbing & HVAC": return <Droplets size={20}/>;
        case "Finishing & Painting": return <PaintBucket size={20}/>;
        case "Landscaping": return <TreeDeciduous size={20}/>;
        default: return <Wrench size={20}/>;
     }
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat(context.locale, { style: 'currency', currency: context.currency }).format(amount);
  };

  // Helper to update state on tier change
  const selectTier = (idx: number, tier: 'budget' | 'standard' | 'premium', unitPrice: number) => {
      setItemsState(prev => ({
          ...prev,
          [idx]: { ...prev[idx], selectedTier: tier, overridePrice: unitPrice }
      }));
  };

  const getItemIcon = (category: string) => {
      switch (category) {
          case 'Labor': return <Clock size={18} className="text-blue-500"/>;
          case 'Material': return <Package size={18} className="text-amber-600"/>;
          case 'Equipment': return <Truck size={18} className="text-slate-600"/>;
          case 'Permits': return <FileCheck size={18} className="text-purple-500"/>;
          default: return <Tag size={18} className="text-slate-400"/>;
      }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xl shadow-slate-200/40 mb-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
         <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-700 rounded-lg text-white"><Sparkles size={20} /></div>
            <div className="flex flex-col">
                <h3 className="font-bold text-slate-900 leading-tight">Smart AI Estimator</h3>
                <span className="text-[10px] text-slate-500 font-medium">
                    {step === 'results' ? (estimateTitle || 'Untitled Estimate') : 'New Estimate'}
                </span>
            </div>
         </div>
         <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button onClick={() => { setMode('estimate'); resetFlow(); }} className={`px-3 py-1 text-xs font-bold rounded transition-all flex items-center gap-1 ${mode === 'estimate' ? 'bg-white shadow text-brand-700' : 'text-slate-500'}`}>
                <PlusCircle size={14}/> New
            </button>
            <button onClick={() => { setMode('change_order'); resetFlow(); }} className={`px-3 py-1 text-xs font-bold rounded transition-all flex items-center gap-1 ${mode === 'change_order' ? 'bg-white shadow text-brand-700' : 'text-slate-500'}`}>
                <FileWarning size={12} /> Change Order
            </button>
         </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

      {step === 'scope' && mode === 'estimate' && (
        <form onSubmit={handleAnalyze} className="animate-slide-up">
          <div className="mb-4">
             <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Estimate Name</label>
             <input 
                type="text"
                value={estimateTitle}
                onChange={(e) => setEstimateTitle(e.target.value)}
                placeholder="e.g. Master Bathroom, Kitchen Floor, Exterior Deck"
                className="w-full bg-slate-50 text-slate-900 rounded-xl border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none border font-bold"
             />
          </div>

          <div className="mb-6 relative">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Project Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder={`Describe the ${selectedTrade || 'work'} in detail... (e.g. "Install 500sqft of drywall in living room, tape and mud to level 4 finish")`}
              rows={4}
              className="w-full bg-white text-slate-900 rounded-xl border-slate-200 p-4 text-sm pr-12 focus:ring-2 focus:ring-brand-500 outline-none border"
            />
            <button 
               type="button" 
               onClick={handleVoiceInput}
               className={`absolute right-3 top-9 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500 hover:bg-brand-500 hover:text-white'}`}
               title="Use Voice Input"
            >
               {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
          
          {/* --- PHOTO UPLOAD SECTION --- */}
          <div className="flex gap-3 mb-4">
             {/* Gallery Button */}
             <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => galleryInputRef.current?.click()} 
                className="flex-1 h-12 border-dashed" 
                icon={isProcessingImage ? <Loader2 size={16} className="animate-spin"/> : <ImageIcon size={16} />}
                disabled={isProcessingImage}
             >
                {isProcessingImage ? 'Processing...' : 'Upload Photo'}
             </Button>
             <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

             {/* Camera Button */}
             <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => cameraInputRef.current?.click()} 
                className="flex-1 h-12 border-dashed" 
                icon={isProcessingImage ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16} />}
                disabled={isProcessingImage}
             >
                {isProcessingImage ? 'Processing...' : 'Take Photo'}
             </Button>
             <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
          </div>

          {/* Preview Area */}
          {selectedImage && (
              <div className="mb-6 relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={selectedImage} alt="Site Context" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    Photo Attached
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-slate-700 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                    title="Remove Photo"
                  >
                      <X size={16} />
                  </button>
              </div>
          )}
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs text-slate-500 flex gap-2 items-start">
             <Info size={16} className="shrink-0 text-brand-500"/>
             <p>AI will search for current market rates in <strong>{context.state || context.country}</strong>. Prices are estimates only.</p>
          </div>

          <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep('trade')}>Back</Button>
              <Button type="submit" isLoading={loading} className="flex-1 py-4 text-lg shadow-lg shadow-brand-500/30">
                 {loading ? <span className="flex items-center gap-2"><span className="animate-pulse">{loadingMsg}</span></span> : "Generate Estimate"}
              </Button>
          </div>
        </form>
      )}

      {mode === 'change_order' && (
         <form onSubmit={handleAnalyze} className="animate-slide-up">
            <div className="space-y-4 mb-6">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Original Scope</label>
                  <textarea value={changeOrderScope.original} onChange={e => setChangeOrderScope({...changeOrderScope, original: e.target.value})} className="w-full p-3 bg-white text-slate-900 rounded-xl text-sm border border-slate-200 focus:ring-brand-500 outline-none" placeholder="What was originally agreed?" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Requirement</label>
                  <textarea value={changeOrderScope.new} onChange={e => setChangeOrderScope({...changeOrderScope, new: e.target.value})} className="w-full p-3 bg-white text-slate-900 rounded-xl text-sm border border-slate-200 focus:ring-brand-500 outline-none" placeholder="What changed?" />
               </div>
            </div>
            <Button type="submit" isLoading={loading} className="w-full">Draft Change Order</Button>
         </form>
      )}
      
      {step === 'trade' && mode === 'estimate' && (
         <div className="grid grid-cols-2 gap-3">
            {Object.entries(INDUSTRIES).map(([name, data]: any) => (
               <button key={name} onClick={() => { setSelectedIndustry(name); setSelectedTrade(data.trades[0]); setStep('scope'); }} className={`p-4 border rounded-xl text-left hover:shadow-md transition-all ${data.color}`}>
                  <div className="mb-2">{getIndustryIcon(name)}</div>
                  <div className="font-bold text-sm">{name}</div>
               </button>
            ))}
         </div>
      )}
      
      {step === 'results' && result && (
         <div className="animate-slide-up space-y-6">
            {/* Title Edit */}
            <div className="flex items-center gap-2 mb-2">
                <input 
                    value={estimateTitle}
                    onChange={(e) => setEstimateTitle(e.target.value)}
                    className="font-bold text-xl text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-brand-500 outline-none bg-transparent w-full"
                    placeholder="Estimate Name"
                />
                <Button size="sm" variant="ghost" onClick={handleManualSave} icon={<Save size={16}/>}>Save</Button>
            </div>

            <div className="flex justify-between items-start">
                <div className="bg-brand-50 p-4 rounded-xl text-sm text-brand-900 border border-brand-100 flex gap-3 items-start flex-1">
                    <Sparkles className="shrink-0 text-brand-600" size={20} />
                    <div>
                        <p className="font-bold mb-1">AI Assessment:</p>
                        {result.summary}
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
               {result.items.map((item, idx) => {
                  const state = itemsState[idx];
                  if (!state) return null;
                  const isLabor = item.category === 'Labor';
                  
                  return (
                     <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${state.isSelected ? 'border-brand-300 ring-1 ring-brand-100 shadow-md' : 'border-slate-200 opacity-60'}`}>
                        {/* Item Header */}
                        <div className={`p-3 flex items-center gap-3 border-b border-slate-100 ${isLabor ? 'bg-blue-50/50' : 'bg-slate-50'}`}>
                           <input 
                              type="checkbox" 
                              checked={state.isSelected} 
                              onChange={e => setItemsState({...itemsState, [idx]: {...state, isSelected: e.target.checked}})}
                              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-slate-300"
                           />
                           <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {getItemIcon(item.category)}
                                <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                              </div>
                              <div className="text-xs text-slate-500 ml-7">{item.category} • {item.unit}</div>
                           </div>
                           {/* Editable Quantity & Price */}
                           <div className="flex items-center gap-2">
                               <div className="text-right">
                                   <label className="text-[9px] text-slate-400 uppercase block font-bold">
                                      {item.unit.toUpperCase()}
                                   </label>
                                   <input 
                                        type="number" 
                                        value={state.overrideQuantity} 
                                        onChange={e => setItemsState({...itemsState, [idx]: {...state, overrideQuantity: parseFloat(e.target.value)}})}
                                        className={`w-16 p-1 text-xs border rounded text-right text-slate-900 font-bold focus:ring-1 focus:ring-brand-500 ${isLabor ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white'}`}
                                   />
                               </div>
                               <div className="text-right">
                                   <label className="text-[9px] text-slate-400 uppercase block">Rate/Price</label>
                                   <input 
                                        type="number" 
                                        value={state.overridePrice} 
                                        onChange={e => setItemsState({...itemsState, [idx]: {...state, overridePrice: parseFloat(e.target.value)}})}
                                        className="w-20 p-1 text-xs border rounded text-right bg-white text-slate-900 font-bold focus:ring-1 focus:ring-brand-500"
                                   />
                               </div>
                           </div>
                        </div>

                        {/* Tier Selector */}
                        {state.isSelected && (
                           <div className="p-3">
                              <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                                 {(['budget', 'standard', 'premium'] as const).map(tier => {
                                    const tierInfo = item.tiers[tier];
                                    return (
                                       <button 
                                          key={tier}
                                          onClick={() => selectTier(idx, tier, tierInfo.unitPrice)}
                                          className={`flex-1 py-2 px-1 text-[10px] uppercase font-bold rounded flex flex-col items-center gap-1 transition-all ${state.selectedTier === tier ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                                       >
                                          <span>{tier}</span>
                                          <span className={state.selectedTier === tier ? 'text-brand-600' : ''}>{formatCurrency(tierInfo.unitPrice)}</span>
                                       </button>
                                    )
                                 })}
                              </div>
                              
                              {/* Reasoning */}
                              {item.reasoning && <div className="mb-2 p-2 bg-blue-50 text-blue-800 text-xs rounded italic border border-blue-100">AI Math: {item.reasoning}</div>}

                              {/* Product Recommendations */}
                              {item.tiers[state.selectedTier].products && item.tiers[state.selectedTier].products!.length > 0 && (
                                 <div className="space-y-1">
                                    {item.tiers[state.selectedTier].products!.map((prod, pIdx) => (
                                       <div key={pIdx} className="flex items-center justify-between text-[10px] text-slate-600">
                                            <span>Rec: {prod.vendor} - {prod.name}</span>
                                            <span className="font-bold">{formatCurrency(prod.price)}</span>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                {/* Detail Level Toggle */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setDetailLevel('simple')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${detailLevel === 'simple' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Simple Invoice</button>
                    <button onClick={() => setDetailLevel('detailed')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${detailLevel === 'detailed' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`}>Detailed Breakdown</button>
                </div>
            </div>

            {selectedImage && (
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2">
                    <input 
                        type="checkbox" 
                        id="saveToGallery" 
                        checked={saveToGallery} 
                        onChange={e => setSaveToGallery(e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <label htmlFor="saveToGallery" className="text-sm font-bold text-slate-700 cursor-pointer">
                        Save photo to Project Gallery (Before/Progress)
                    </label>
                </div>
            )}

            <div className="flex gap-3">
               <Button variant="outline" onClick={resetFlow} className="flex-1">New Estimate</Button>
               <Button 
                   onClick={handleAddSelected} 
                   className={`flex-[2] transition-all ${buttonState === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}`} 
                   icon={buttonState === 'success' ? <CheckCircle2 size={18}/> : <ArrowRight size={18}/>}
               >
                   {buttonState === 'success' ? 'Added!' : 'Add to Invoice'}
               </Button>
            </div>
         </div>
      )}
    </div>
  );
};
