

import React, { useState, useRef, useEffect } from 'react';
import { Project, AppMode, BusinessProfile, InvoiceData, UserSubscription, TeamMember, CalendarEvent, Expense, ReceiptData, LineItem, ProjectEstimate, TimeLog } from '../types';
import { Button } from './Button';
import { ArrowLeft, Zap, Layers, Save, Trash2, Plus, ScanLine, Receipt, Image as ImageIcon, X, RotateCcw, History, Redo, Edit2, Check, FileText, ArrowRight, PlusCircle, LayoutGrid, CheckCircle } from 'lucide-react';
import { SmartEstimator } from './SmartEstimator';
import { InvoicePreview } from './InvoicePreview';
import { BusinessTools } from './BusinessTools';
import { parseReceiptImage } from '../services/geminiService';
import { compressImage } from '../utils';
import { v4 as uuidv4 } from 'uuid';

interface ProjectWorkspaceProps {
  project: Project;
  onSaveProject: (p: Project) => void;
  onBack: () => void;
  business: BusinessProfile;
  onUpdateBusiness: (b: BusinessProfile) => void; // NEW
  subscription: UserSubscription;
  onConsumeCredit: (amount: number) => void;
  teamMembers: TeamMember[];
  onAddMember: (m: TeamMember) => void;
  onUpdateMember: (m: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  timeLogs?: TimeLog[]; 
  onLogTime?: (log: TimeLog) => void; 
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  onSaveProject,
  onBack,
  business,
  onUpdateBusiness,
  subscription,
  onConsumeCredit,
  teamMembers,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  timeLogs,
  onLogTime
}) => {
  const [mode, setMode] = useState<AppMode>('easy');
  const [activeTab, setActiveTab] = useState<'overview' | 'editor' | 'tools' | 'files' | 'history'>('overview');
  const [activeEstimateId, setActiveEstimateId] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<Project[]>([project]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Receipt Scanning State
  const [isScanningReceipt, setIsScanningReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [selectedReceiptIndices, setSelectedReceiptIndices] = useState<number[]>([]);
  const [addReceiptToInvoiceItems, setAddReceiptToInvoiceItems] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const afterPhotoInputRef = useRef<HTMLInputElement>(null);
  const invoiceEditorRef = useRef<HTMLDivElement>(null);

  // --- DRAFT INVOICE INIT ---
  useEffect(() => {
     if (project.invoices.length === 0) {
         const draftInv: InvoiceData = {
            id: uuidv4(),
            projectId: project.id,
            number: 'DRAFT',
            status: 'draft',
            date: new Date().toISOString().split('T')[0],
            dueDate: '',
            taxRate: business.defaultTaxRate || 0,
            items: [],
            expenses: [],
            notes: '',
            terms: '',
            photos: [],
            client: project.client,
            history: []
         };
         handleProjectUpdate({ ...project, invoices: [draftInv] });
     }
  }, [project.invoices.length]);

  // --- HISTORY HANDLERS ---
  const saveToHistory = (newProjectState: Project) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newProjectState);
      // Limit history to last 50 steps
      if (newHistory.length > 50) newHistory.shift();
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      onSaveProject(newProjectState);
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          const prevIndex = historyIndex - 1;
          setHistoryIndex(prevIndex);
          onSaveProject(history[prevIndex]);
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          const nextIndex = historyIndex + 1;
          setHistoryIndex(nextIndex);
          onSaveProject(history[nextIndex]);
      }
  };
  
  const handleRestoreVersion = (versionIndex: number) => {
      const restoredProject = history[versionIndex];
      saveToHistory(restoredProject);
      alert("Version restored successfully.");
  };

  // Wrapper for updates to ensure history is tracked
  const handleProjectUpdate = (updatedProject: Project) => {
      saveToHistory(updatedProject);
  };

  // --- EVENT HANDLERS ---
  const handleAddEvent = (evt: CalendarEvent) => {
    const currentEvents = project.events || [];
    const updatedEvents = [...currentEvents, evt];
    handleProjectUpdate({ ...project, events: updatedEvents });
  };

  const handleUpdateEvent = (evt: CalendarEvent) => {
    const currentEvents = project.events || [];
    const updatedEvents = currentEvents.map(e => e.id === evt.id ? evt : e);
    handleProjectUpdate({ ...project, events: updatedEvents });
  };

  const handleDeleteEvent = (id: string) => {
    console.log('Deleting event', id);
    const currentEvents = project.events || [];
    const updatedEvents = currentEvents.filter(e => e.id !== id);
    handleProjectUpdate({ ...project, events: updatedEvents });
  };

  // Primary Invoice Logic
  const primaryInvoice = project.invoices.length > 0 ? project.invoices[0] : {
    id: uuidv4(),
    projectId: project.id,
    number: 'DRAFT',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    taxRate: business.defaultTaxRate || 0,
    items: [],
    expenses: [],
    notes: '',
    terms: '',
    photos: [],
    client: project.client,
    history: []
  } as InvoiceData;

  const handleUpdateInvoice = (inv: InvoiceData) => {
    const exists = project.invoices.some(i => i.id === inv.id);
    let updatedInvoices;
    if (exists) {
      updatedInvoices = project.invoices.map(i => i.id === inv.id ? inv : i);
    } else {
      updatedInvoices = [...project.invoices, inv];
    }
    handleProjectUpdate({ ...project, invoices: updatedInvoices });
  };
  
  // Save Estimate Handler
  const handleSaveEstimate = (estimate: ProjectEstimate) => {
      const currentEstimates = project.estimates || [];
      const existingIdx = currentEstimates.findIndex(e => e.id === estimate.id);
      
      let updatedEstimates;
      if (existingIdx >= 0) {
          updatedEstimates = [...currentEstimates];
          updatedEstimates[existingIdx] = estimate;
      } else {
          // Add new estimate to the TOP of the list
          updatedEstimates = [estimate, ...currentEstimates];
      }
      
      handleProjectUpdate({ ...project, estimates: updatedEstimates });
      setActiveEstimateId(estimate.id);
  };
  
  const handleDeleteEstimate = (id: string) => {
      console.log('Deleting estimate', id);
      const updatedEstimates = (project.estimates || []).filter(e => e.id !== id);
      handleProjectUpdate({ ...project, estimates: updatedEstimates });
      if (activeEstimateId === id) setActiveEstimateId(null);
  };
  
  const loadEstimate = (id: string) => {
      setActiveEstimateId(id);
      if (mode === 'advanced') setActiveTab('editor');
  };

  const startNewEstimate = () => {
      setActiveEstimateId(null); // This clears the active ID so SmartEstimator resets
      if (mode === 'advanced') setActiveTab('editor');
  };

  // --- RECEIPT LOGIC ---
  const handleReceiptScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningReceipt(true);
    try {
       const compressed = await compressImage(file);
       const parsed = await parseReceiptImage(compressed);
       if (parsed) {
          setReceiptData(parsed);
          // Select all items by default
          setSelectedReceiptIndices(parsed.items.map((_, i) => i));
       }
       onConsumeCredit(1);
    } catch (err) {
       console.error(err);
       alert("Failed to scan receipt.");
    } finally {
       setIsScanningReceipt(false);
    }
  };

  const toggleReceiptItem = (idx: number) => {
      setSelectedReceiptIndices(prev => 
          prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
  };

  const handleConfirmReceipt = () => {
     if (!receiptData) return;
     const itemsToInclude = receiptData.items.filter((_, i) => selectedReceiptIndices.includes(i));
     
     // Create Expenses (Internal Cost Tracking)
     const newExpenses: Expense[] = itemsToInclude.map(item => ({
        id: uuidv4(),
        description: `${receiptData.merchant} - ${item.description}`,
        amount: item.amount,
        date: receiptData.date || new Date().toISOString(),
        category: 'Material',
        items: [item]
     }));
     
     let updatedInvoice = { ...primaryInvoice, expenses: [...primaryInvoice.expenses, ...newExpenses] };

     // Optionally Add to Invoice Items (Billable to Client)
     if (addReceiptToInvoiceItems) {
         const newLineItems: LineItem[] = itemsToInclude.map(item => ({
             id: uuidv4(),
             description: item.description,
             quantity: 1,
             unitPrice: item.amount,
             unit: 'ea',
             taxable: true
         }));
         updatedInvoice = { ...updatedInvoice, items: [...updatedInvoice.items, ...newLineItems] };
     }
     
     handleUpdateInvoice(updatedInvoice);
     setReceiptData(null);
     setSelectedReceiptIndices([]);
     setAddReceiptToInvoiceItems(false);
  };
  
  const handleDeleteExpense = (id: string) => {
      console.log('Deleting expense', id);
      const updatedExpenses = primaryInvoice.expenses.filter(e => e.id !== id);
      handleUpdateInvoice({ ...primaryInvoice, expenses: updatedExpenses });
  };

  // --- PHOTO LOGIC ---
  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const compressed = await compressImage(file);
        handleProjectUpdate({ ...project, photos: [...project.photos, compressed] });
     }
  };

  const handleAddAfterPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const compressed = await compressImage(file);
       handleProjectUpdate({ ...project, afterPhotos: [...(project.afterPhotos || []), compressed] });
    }
  };
  
  // --- INVOICE ITEM EDITOR UI ---
  const InvoiceItemsEditor = () => {
    return (
      <div ref={invoiceEditorRef} className="bg-white rounded-xl border border-slate-200 p-4 mt-6 scroll-mt-20">
         <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase">Invoice Items</h3>
            <Button size="sm" variant="secondary" onClick={() => {
               const newItem: LineItem = { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, unit: 'ea', taxable: true };
               handleUpdateInvoice({ ...primaryInvoice, items: [...primaryInvoice.items, newItem] });
            }} icon={<Plus size={14}/>}>Add Line</Button>
         </div>
         <div className="space-y-2">
            {primaryInvoice.items.length === 0 && <div className="text-center text-slate-400 text-xs py-4">No items. Use the AI Estimator or Add Manually.</div>}
            {primaryInvoice.items.map((item, idx) => (
               <div key={item.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1 space-y-1">
                     <textarea 
                        value={item.description}
                        onChange={e => {
                            const newItems = [...primaryInvoice.items];
                            newItems[idx] = { ...item, description: e.target.value };
                            handleUpdateInvoice({ ...primaryInvoice, items: newItems });
                        }}
                        placeholder="Description"
                        rows={item.description.length > 50 ? 2 : 1}
                        className="w-full p-2 text-sm bg-white border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 outline-none resize-none font-medium text-slate-900"
                        style={{ fontWeight: item.description.startsWith('---') ? 'bold' : 'normal', color: item.description.startsWith('---') ? '#475569' : 'inherit' }}
                     />
                  </div>
                  {/* Hide Inputs for Header Rows */}
                  {!item.description.startsWith('---') && (
                    <>
                      <div className="w-16">
                         <input 
                            type="number" 
                            value={item.quantity}
                            onChange={e => {
                                const newItems = [...primaryInvoice.items];
                                newItems[idx] = { ...item, quantity: parseFloat(e.target.value) };
                                handleUpdateInvoice({ ...primaryInvoice, items: newItems });
                            }}
                            className="w-full p-2 text-sm bg-white border border-slate-300 rounded text-center font-bold text-slate-900"
                         />
                      </div>
                      <div className="w-20">
                         <input 
                            type="number" 
                            value={item.unitPrice}
                            onChange={e => {
                                const newItems = [...primaryInvoice.items];
                                newItems[idx] = { ...item, unitPrice: parseFloat(e.target.value) };
                                handleUpdateInvoice({ ...primaryInvoice, items: newItems });
                            }}
                            className="w-full p-2 text-sm bg-white border border-slate-300 rounded text-right font-bold text-slate-900"
                         />
                      </div>
                    </>
                  )}
                   <button 
                      type="button"
                      onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         console.log('Deleting invoice item', idx);
                         const newItems = primaryInvoice.items.filter((_, i) => i !== idx);
                         handleUpdateInvoice({ ...primaryInvoice, items: newItems });
                      }} 
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded"
                   >
                      <Trash2 size={16}/>
                   </button>
               </div>
            ))}
         </div>
      </div>
    );
  };

  // --- ESTIMATE LIST COMPONENT ---
  const EstimateList = () => {
      return (
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2"><LayoutGrid size={16}/> Saved Estimates</h3>
              </div>
              
              {(!project.estimates || project.estimates.length === 0) ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <FileText className="mx-auto text-slate-300 mb-2" size={32}/>
                      <p className="text-sm text-slate-500 font-medium">No estimates yet.</p>
                      <p className="text-xs text-slate-400 mb-4">Create multiple options (e.g. Kitchen, Bath) for one project.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {project.estimates.map(est => (
                          <div 
                            key={est.id} 
                            onClick={() => loadEstimate(est.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group relative flex flex-col h-32 justify-between ${activeEstimateId === est.id ? 'bg-brand-50 border-brand-400 ring-2 ring-brand-100' : 'bg-slate-50 border-slate-200 hover:border-brand-300 hover:shadow-md'}`}
                          >
                              <div>
                                  <div className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">{est.title || "Untitled Estimate"}</div>
                                  <div className="text-[10px] text-slate-500">{new Date(est.timestamp).toLocaleDateString()}</div>
                              </div>
                              
                              <div className="flex justify-between items-end mt-2">
                                  <div className="text-xs text-slate-600 font-medium bg-white px-2 py-1 rounded border border-slate-100">
                                      {est.items.length} Items
                                  </div>
                                  <button 
                                     type="button"
                                     onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Estimate delete clicked', est.id);
                                        handleDeleteEstimate(est.id);
                                     }} 
                                     className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-colors z-10"
                                     title="Delete Estimate"
                                  >
                                     <Trash2 size={14}/>
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
       {/* Receipt Analysis Modal - Truncated for space, logic preserved */}
       {receiptData && (
           <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up border border-slate-200">
                   {/* ... Modal Content ... */}
                   <div className="bg-brand-700 p-4 text-white flex justify-between items-center">
                       <h3 className="font-bold flex items-center gap-2"><Receipt size={20}/> Receipt Analysis</h3>
                       <button onClick={() => setReceiptData(null)} className="hover:bg-brand-600 p-1 rounded"><X size={20}/></button>
                   </div>
                   <div className="p-6">
                       <div className="mb-6 text-center border-b border-slate-100 pb-4">
                           <p className="text-xs font-bold uppercase text-slate-400 mb-1">Merchant</p>
                           <p className="font-bold text-xl text-slate-900">{receiptData.merchant}</p>
                           <p className="text-slate-500 text-sm mt-1">{receiptData.date}</p>
                       </div>
                       
                       <div className="mb-4">
                           <div className="flex justify-between items-end mb-2">
                               <label className="text-xs font-bold uppercase text-slate-500">Detected Items</label>
                               <button 
                                   onClick={() => setSelectedReceiptIndices(receiptData.items.map((_, i) => i))}
                                   className="text-xs text-brand-600 font-medium hover:underline"
                               >
                                   Select All
                               </button>
                           </div>
                           <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                               {receiptData.items.map((item, idx) => (
                                   <div 
                                       key={idx} 
                                       onClick={() => toggleReceiptItem(idx)}
                                       className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedReceiptIndices.includes(idx) ? 'bg-brand-50 border-brand-200 ring-1 ring-brand-100' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                                   >
                                       <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${selectedReceiptIndices.includes(idx) ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'}`}>
                                           {selectedReceiptIndices.includes(idx) && <Check size={12} strokeWidth={3}/>}
                                       </div>
                                       <div className="flex-1 min-w-0">
                                           <div className="text-sm font-medium text-slate-900 truncate">{item.description}</div>
                                       </div>
                                       <div className="font-bold text-sm text-slate-700">${item.amount.toFixed(2)}</div>
                                   </div>
                               ))}
                           </div>
                       </div>

                       <div className="flex justify-between items-center pt-4 border-t border-slate-100 mb-4">
                           <span className="font-bold text-slate-500 text-sm">Total to Add</span>
                           <span className="text-2xl font-bold text-brand-700">
                               ${receiptData.items.filter((_, i) => selectedReceiptIndices.includes(i)).reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                           </span>
                       </div>
                       
                       <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                           <input 
                               type="checkbox" 
                               id="addToInvoice"
                               checked={addReceiptToInvoiceItems}
                               onChange={(e) => setAddReceiptToInvoiceItems(e.target.checked)}
                               className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-slate-300 cursor-pointer"
                           />
                           <label htmlFor="addToInvoice" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                               Also add to Invoice as Billable Items
                           </label>
                       </div>

                       <div className="flex gap-3">
                           <Button variant="secondary" className="flex-1" onClick={() => setReceiptData(null)}>Cancel</Button>
                           <Button className="flex-[2]" onClick={handleConfirmReceipt} icon={<Check size={18}/>}>Add Expenses</Button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Project Header */}
       <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4 flex-1">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ArrowLeft size={20}/></button>
             <div className="flex-1 max-w-md">
                <div className="flex items-center gap-2">
                   <input 
                      value={project.title} 
                      onChange={(e) => handleProjectUpdate({...project, title: e.target.value})}
                      onFocus={(e) => e.target.select()}
                      className="font-bold text-lg text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 outline-none w-full transition-all focus:ring-2 focus:ring-brand-500"
                   />
                   <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase shrink-0 ${project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{project.status}</span>
                </div>
                <div className="text-xs text-slate-500 px-2">{project.client.name}</div>
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             {/* Undo / Redo Controls */}
             <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button onClick={handleUndo} disabled={historyIndex === 0} className="p-1.5 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors" title="Undo"><RotateCcw size={16}/></button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-1.5 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors" title="Redo"><Redo size={16}/></button>
             </div>

             {/* Mode Switcher */}
             <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 hidden md:flex">
                <button onClick={() => setMode('easy')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${mode === 'easy' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}>
                   <Zap size={14}/> Easy
                </button>
                <button onClick={() => setMode('advanced')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${mode === 'advanced' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}>
                   <Layers size={14}/> Advanced
                </button>
             </div>
             <Button size="sm" icon={<Save size={16}/>} onClick={() => { onSaveProject(project); alert('Project Saved'); }}>Save</Button>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 overflow-hidden">
          
          {/* --- EASY MODE --- */}
          {mode === 'easy' && (
            <div className="h-full overflow-y-auto p-4 md:p-8 bg-slate-50">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                  {/* Step 1: Brief */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">1</div>
                      <h3 className="font-bold text-slate-900 text-lg">Project Brief</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Project Name</label>
                         <input 
                           value={project.title} 
                           onChange={e => handleProjectUpdate({...project, title: e.target.value})} 
                           onFocus={e => e.target.select()}
                           className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Client Name</label>
                         <input
                           value={project.client.name}
                           onChange={e => handleProjectUpdate({...project, client: {...project.client, name: e.target.value}})}
                           onFocus={e => e.target.select()}
                           className="w-full p-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                           placeholder="Client Name"
                         />
                       </div>
                    </div>
                  </div>

                  {/* Step 2: Scope & Expenses */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                       <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">2</div>
                       <h3 className="font-bold text-slate-900 text-lg">Estimate & Expenses</h3>
                    </div>
                    
                    {/* Saved Estimates List */}
                    <EstimateList />

                    <SmartEstimator 
                       onAddToInvoice={(data) => {
                          // Add Items
                          const newItems = data.items.map(item => ({ id: uuidv4(), ...item, taxable: true }));
                          let updatedInv = { ...primaryInvoice, items: [...primaryInvoice.items, ...newItems] };
                          let updatedProject = { ...project };
                          
                          // Add Photo
                          if (data.photo) {
                             updatedInv = { ...updatedInv, photos: [...(updatedInv.photos || []), data.photo] };
                             if (data.saveToGallery) {
                                updatedProject = { ...updatedProject, photos: [...(updatedProject.photos || []), data.photo] };
                             }
                          }

                          updatedProject.invoices = updatedProject.invoices.map(i => i.id === primaryInvoice.id ? updatedInv : i);
                          handleProjectUpdate(updatedProject);
                          
                          // Auto Scroll to Editor
                          if (invoiceEditorRef.current) {
                              setTimeout(() => {
                                  invoiceEditorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 100);
                          }
                       }}
                       onSaveEstimate={handleSaveEstimate}
                       existingEstimate={project.estimates?.find(e => e.id === activeEstimateId)}
                       availableCredits={subscription.credits}
                       userPlan={subscription.plan}
                       onUpgrade={() => {}}
                       onConsumeCredit={onConsumeCredit}
                       onRecordUsage={() => {}}
                       context={{ country: business.country, currency: business.currency, locale: business.locale, state: business.state }}
                    />

                    <InvoiceItemsEditor />
                    
                    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2"><Receipt size={16}/> Add Expenses / Scan Receipts</h4>
                            <Button size="sm" variant="secondary" onClick={() => receiptInputRef.current?.click()} icon={isScanningReceipt ? <ScanLine className="animate-spin"/> : <ScanLine/>}>
                                {isScanningReceipt ? 'Scanning...' : 'Scan Receipt'}
                            </Button>
                            <input type="file" ref={receiptInputRef} className="hidden" accept="image/*" onChange={handleReceiptScan} />
                        </div>
                        <div className="space-y-2">
                            {primaryInvoice.expenses.map(exp => (
                                <div key={exp.id} className="flex justify-between items-center p-3 bg-white rounded-xl text-sm border border-slate-200 shadow-sm">
                                    <div className="flex-1">
                                        <span className="block font-bold text-slate-900">{exp.description}</span>
                                        <span className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">${exp.amount.toFixed(2)}</span>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteExpense(exp.id);
                                            }} 
                                            className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {primaryInvoice.expenses.length === 0 && <div className="text-xs text-slate-400 italic text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">No expenses logged yet.</div>}
                        </div>
                    </div>
                  </div>

                  {/* Step 3: Review */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">3</div>
                        <h3 className="font-bold text-slate-900 text-lg">Review & Send</h3>
                     </div>
                     <InvoicePreview business={business} invoice={primaryInvoice} />
                  </div>
                </div>
            </div>
          )}

          {/* --- ADVANCED MODE --- */}
          {mode === 'advanced' && (
            <div className="h-full flex flex-col">
              <div className="flex border-b border-slate-200 bg-white px-6 shrink-0 overflow-x-auto">
                 <button onClick={() => setActiveTab('overview')} className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Overview</button>
                 <button onClick={() => setActiveTab('editor')} className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'editor' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Invoices & Estimates</button>
                 <button onClick={() => setActiveTab('tools')} className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'tools' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Schedule & Tools</button>
                 <button onClick={() => setActiveTab('files')} className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'files' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Files & Photos</button>
                 <button onClick={() => setActiveTab('history')} className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'history' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>History</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                 {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                          <h3 className="font-bold text-slate-900 text-lg mb-6">Project Details</h3>
                          <div className="mb-6">
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Project Title</label>
                            <input 
                              value={project.title} 
                              onChange={e => handleProjectUpdate({...project, title: e.target.value})}
                              onFocus={e => e.target.select()}
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            />
                          </div>
                          <textarea 
                            className="w-full p-4 bg-white text-slate-900 rounded-xl border border-slate-300 h-32 resize-none focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                            placeholder="Add internal notes..." 
                            value={project.notes} 
                            onChange={e => handleProjectUpdate({...project, notes: e.target.value})}
                          />
                       </div>
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                          <h3 className="font-bold text-slate-900 mb-6 text-lg border-b border-slate-100 pb-4">Client Details</h3>
                          <input value={project.client.name} onChange={e => handleProjectUpdate({...project, client: {...project.client, name: e.target.value}})} className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-bold mb-2" />
                          <input value={project.client.email} onChange={e => handleProjectUpdate({...project, client: {...project.client, email: e.target.value}})} className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 mb-2" placeholder="Email" />
                       </div>
                    </div>
                 )}

                 {activeTab === 'editor' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                       {/* ... Editor Logic ... */}
                       <div className="space-y-6">
                          
                          <EstimateList />

                          <SmartEstimator 
                             onAddToInvoice={(data) => {
                                // ...
                                const newItems = data.items.map(item => ({ id: uuidv4(), ...item, taxable: true }));
                                let updatedInv = { ...primaryInvoice, items: [...primaryInvoice.items, ...newItems] };
                                let updatedProject = { ...project };
                                
                                if (data.photo) {
                                   updatedInv = { ...updatedInv, photos: [...(updatedInv.photos || []), data.photo] };
                                   if (data.saveToGallery) {
                                      updatedProject = { ...updatedProject, photos: [...(updatedProject.photos || []), data.photo] };
                                   }
                                }
                                
                                updatedProject.invoices = updatedProject.invoices.map(i => i.id === primaryInvoice.id ? updatedInv : i);
                                handleProjectUpdate(updatedProject);
                                
                                if (invoiceEditorRef.current) {
                                    setTimeout(() => {
                                        invoiceEditorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }, 100);
                                }
                             }}
                             onSaveEstimate={handleSaveEstimate}
                             existingEstimate={project.estimates?.find(e => e.id === activeEstimateId)}
                             availableCredits={subscription.credits} userPlan={subscription.plan}
                             onUpgrade={() => {}} onConsumeCredit={onConsumeCredit} onRecordUsage={() => {}}
                             context={{ country: business.country, currency: business.currency, locale: business.locale, state: business.state }}
                          />

                          <InvoiceItemsEditor />
                          
                          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Receipt size={18}/> Expenses & Receipts</h3>
                                <Button size="sm" variant="secondary" onClick={() => receiptInputRef.current?.click()} icon={isScanningReceipt ? <ScanLine className="animate-spin"/> : <ScanLine/>}>
                                   {isScanningReceipt ? 'Scanning...' : 'Scan Receipt'}
                                </Button>
                             </div>
                             <input type="file" ref={receiptInputRef} className="hidden" accept="image/*" onChange={handleReceiptScan} />
                             <div className="space-y-2">
                                {primaryInvoice.expenses.map(exp => (
                                   <div key={exp.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-sm border border-slate-100 group hover:border-brand-200 transition-colors">
                                      <div className="flex-1">
                                        <span className="block font-bold text-slate-900">{exp.description}</span>
                                        <span className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-900">${exp.amount.toFixed(2)}</span>
                                        <button 
                                           type="button"
                                           onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              console.log('Expense delete clicked', exp.id);
                                              handleDeleteExpense(exp.id);
                                           }} 
                                           className="text-slate-300 hover:text-red-500 transition-opacity p-2 hover:bg-white rounded-full shadow-sm"
                                        >
                                           <Trash2 size={16}/>
                                        </button>
                                      </div>
                                   </div>
                                ))}
                                {primaryInvoice.expenses.length === 0 && <div className="text-xs text-slate-400 italic text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">No expenses logged.</div>}
                             </div>
                          </div>
                       </div>
                       <div>
                          <InvoicePreview business={business} invoice={primaryInvoice} />
                       </div>
                    </div>
                 )}

                 {activeTab === 'tools' && (
                    <div className="animate-fade-in">
                        <BusinessTools 
                           teamMembers={teamMembers}
                           events={project.events || []} 
                           onAddEvent={handleAddEvent}
                           onUpdateEvent={handleUpdateEvent}
                           onDeleteEvent={handleDeleteEvent}
                           onAddMember={onAddMember}
                           onUpdateMember={onUpdateMember}
                           onDeleteMember={onDeleteMember}
                           projectContext={{
                               id: project.id,
                               title: project.title,
                               clientName: project.client.name,
                               startDate: project.startDate
                           }}
                           timeline={project.timeline}
                           onUpdateProjectTimeline={(timeline) => {
                               handleProjectUpdate({...project, timeline});
                           }}
                           timeLogs={timeLogs} 
                           onLogTime={onLogTime} 
                           business={business} // NEW
                           onUpdateBusiness={onUpdateBusiness} // NEW
                        />
                    </div>
                 )}

                 {activeTab === 'files' && (
                     <div className="animate-fade-in space-y-8">
                         {/* Before / Progress Section */}
                         <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Before & Progress Gallery</h2>
                                <Button onClick={() => photoInputRef.current?.click()} icon={<Plus size={16}/>}>Add Photo</Button>
                                <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handleAddPhoto} />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {project.photos.map((photo, idx) => (
                                    <div key={idx} className="aspect-square bg-slate-200 rounded-xl overflow-hidden relative group shadow-sm border border-slate-200">
                                        <img src={photo} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                        <button 
                                            type="button"
                                            onClick={(e) => { 
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleProjectUpdate({...project, photos: project.photos.filter((_, i) => i !== idx)});
                                            }} 
                                            className="absolute top-2 right-2 p-2 bg-white/90 text-slate-700 rounded-full transition-all hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 shadow-lg transform translate-y-2 group-hover:translate-y-0"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                ))}
                                {project.photos.length === 0 && (
                                    <div className="col-span-full text-center py-12 bg-white border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50"/>
                                        <p>No start photos yet.</p>
                                    </div>
                                )}
                            </div>
                         </div>
                         
                         {/* After / Completed Section */}
                         <div>
                            <div className="flex justify-between items-center mb-6 border-t border-slate-200 pt-6">
                                <h2 className="text-xl font-bold text-slate-900">After & Completed Gallery</h2>
                                <Button onClick={() => afterPhotoInputRef.current?.click()} icon={<Plus size={16}/>} variant="secondary">Add Final Photo</Button>
                                <input type="file" ref={afterPhotoInputRef} className="hidden" accept="image/*" onChange={handleAddAfterPhoto} />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(project.afterPhotos || []).map((photo, idx) => (
                                    <div key={idx} className="aspect-square bg-slate-200 rounded-xl overflow-hidden relative group shadow-sm border border-slate-200">
                                        <img src={photo} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                        <div className="absolute bottom-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded">AFTER</div>
                                        <button 
                                            type="button"
                                            onClick={(e) => { 
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const newAfter = (project.afterPhotos || []).filter((_, i) => i !== idx);
                                            handleProjectUpdate({...project, afterPhotos: newAfter});
                                            }} 
                                            className="absolute top-2 right-2 p-2 bg-white/90 text-slate-700 rounded-full transition-all hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 shadow-lg transform translate-y-2 group-hover:translate-y-0"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                ))}
                                {(!project.afterPhotos || project.afterPhotos.length === 0) && (
                                    <div className="col-span-full text-center py-12 bg-white border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                                        <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-emerald-500"/>
                                        <p>No completed photos yet.</p>
                                    </div>
                                )}
                            </div>
                         </div>
                     </div>
                 )}

                 {activeTab === 'history' && (
                     <div className="animate-fade-in max-w-3xl mx-auto">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Version History</h2>
                            <div className="text-sm text-slate-500">Total versions: {history.length}</div>
                         </div>
                         <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                             {history.slice().reverse().map((ver, idx) => {
                                 // Calculate true index since we reversed the map
                                 const trueIndex = history.length - 1 - idx;
                                 return (
                                     <div key={trueIndex} className={`p-4 border-b border-slate-100 flex justify-between items-center hover:bg-slate-50 transition-colors ${trueIndex === historyIndex ? 'bg-brand-50 border-l-4 border-l-brand-500' : ''}`}>
                                         <div className="flex items-center gap-3">
                                             <div className="bg-slate-100 p-2 rounded-full"><History size={16} className="text-slate-600"/></div>
                                             <div>
                                                 <div className="font-bold text-slate-900">Version {trueIndex + 1}</div>
                                                 <div className="text-xs text-slate-500">
                                                     {ver.invoices[0]?.items.length} Items • {ver.status}
                                                 </div>
                                             </div>
                                         </div>
                                         {trueIndex !== historyIndex && (
                                             <Button size="sm" variant="secondary" onClick={() => handleRestoreVersion(trueIndex)} icon={<RotateCcw size={14}/>}>Restore</Button>
                                         )}
                                         {trueIndex === historyIndex && <span className="text-xs font-bold text-brand-600 bg-brand-100 px-2 py-1 rounded">Current</span>}
                                     </div>
                                 );
                             })}
                         </div>
                     </div>
                 )}
              </div>
            </div>
          )}
       </div>
    </div>
  );
};