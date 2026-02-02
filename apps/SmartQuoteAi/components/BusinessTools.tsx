

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Calculator, FileSignature, Plus, Trash2, Check, ShieldCheck, Printer, Ruler, PaintBucket, Box, Grid, Snowflake, Layers, Shovel, Home, Clock, Edit2, X, FileText, LayoutTemplate, CheckCircle, Thermometer, Trello, DollarSign, Briefcase, Phone, MoreHorizontal, Timer, Settings } from 'lucide-react';
import { Button } from './Button';
import { TeamMember, CalendarEvent, JobTemplate, JobTimeline, ProjectContext, TimelineStage, TimeLog, BusinessProfile, PayrollSettings } from '../types';
import { generateSafetyChecklist } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface ToolsProps {
  teamMembers: TeamMember[];
  events: CalendarEvent[];
  onAddEvent: (e: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateEvent?: (e: CalendarEvent) => void;
  onAddMember: (m: TeamMember) => void;
  onUpdateMember?: (m: TeamMember) => void;
  onDeleteMember?: (id: string) => void;
  projectContext?: ProjectContext; 
  timeline?: JobTimeline;
  onUpdateProjectTimeline?: (timeline: JobTimeline) => void;
  timeLogs?: TimeLog[]; 
  onLogTime?: (log: TimeLog) => void; 
  business?: BusinessProfile; // NEW
  onUpdateBusiness?: (b: BusinessProfile) => void; // NEW
}

type UnitSystem = 'imperial' | 'metric';

type CalculatorType = 'drywall' | 'paint' | 'concrete' | 'flooring' | 'framing' | 'roofing' | 'insulation' | 'mulch' | 'tile' | 'decking' | 'hvac';

interface CalculatorDef {
  id: CalculatorType;
  name: string;
  icon: React.ReactNode;
  color: string;
  inputs: ('area' | 'length' | 'width' | 'depth' | 'height' | 'coats')[];
  calculate: (inputs: any, system: UnitSystem) => { label: string; value: string }[];
}

// Helper to get labels based on system
const getLabel = (inputType: string, system: UnitSystem): string => {
    switch(inputType) {
        case 'area': return system === 'imperial' ? 'Area (sq ft)' : 'Area (m²)';
        case 'length': return system === 'imperial' ? 'Length (ft)' : 'Length (m)';
        case 'width': return system === 'imperial' ? 'Width (ft)' : 'Width (m)';
        case 'depth': return system === 'imperial' ? 'Depth (inches)' : 'Depth (cm)';
        case 'height': return system === 'imperial' ? 'Height (ft)' : 'Height (m)';
        case 'coats': return 'Number of Coats';
        default: return inputType;
    }
};

const CALCULATORS: CalculatorDef[] = [
  // ... (Calculators remain same, just preserving them in the output)
  {
    id: 'drywall',
    name: 'Drywall',
    icon: <Grid size={20}/>,
    color: 'bg-slate-100 text-slate-600',
    inputs: ['area'],
    calculate: (i, system) => {
      const sheetSize = system === 'imperial' ? 32 : 2.88;
      const sheets = Math.ceil((i.area * 1.1) / sheetSize); 
      const mud = Math.ceil(i.area / (system === 'imperial' ? 500 : 46));
      const mudUnit = system === 'imperial' ? '5gal Buckets' : '18L Buckets';
      return [
        { label: `${system === 'imperial' ? '4x8' : '1.2x2.4m'} Sheets (+10%)`, value: `${sheets}` },
        { label: `Joint Compound (${mudUnit})`, value: `${mud}` },
        { label: 'Tape Rolls', value: `${Math.ceil(i.area / (system === 'imperial' ? 250 : 23))}` }, 
        { label: 'Screws (approx)', value: `${Math.ceil(sheets * 50)}` } 
      ];
    }
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: <PaintBucket size={20}/>,
    color: 'bg-blue-100 text-blue-600',
    inputs: ['area', 'coats'],
    calculate: (i, system) => {
      const coverage = system === 'imperial' ? 350 : 9;
      const unit = system === 'imperial' ? 'Gallons' : 'Liters';
      const paintNeeded = Math.ceil((i.area * (i.coats || 2)) / coverage);
      const primerNeeded = Math.ceil(i.area / (system === 'imperial' ? 250 : 6)); 
      return [
        { label: `Paint Needed (${unit})`, value: `${paintNeeded}` },
        { label: `Primer Needed (${unit})`, value: `${primerNeeded}` }
      ];
    }
  },
  {
    id: 'concrete',
    name: 'Concrete',
    icon: <Layers size={20}/>,
    color: 'bg-stone-100 text-stone-600',
    inputs: ['length', 'width', 'depth'],
    calculate: (i, system) => {
      let volume = 0;
      let label = '';
      let bags80 = 0;
      let bags60 = 0;

      if (system === 'imperial') {
          const cuFt = i.length * i.width * (i.depth / 12);
          volume = cuFt / 27;
          label = 'Cubic Yards';
          bags80 = cuFt / 0.6; 
          bags60 = cuFt / 0.45;
      } else {
          volume = i.length * i.width * (i.depth / 100);
          label = 'Cubic Meters';
          bags80 = volume * 55; 
          bags60 = volume * 70; 
      }

      return [
        { label: label, value: volume.toFixed(2) },
        { label: system === 'imperial' ? '80lb Bags' : '30kg Bags', value: Math.ceil(bags80).toString() },
        { label: system === 'imperial' ? '60lb Bags' : '20kg Bags', value: Math.ceil(bags60).toString() }
      ];
    }
  },
  {
    id: 'framing',
    name: 'Framing',
    icon: <Ruler size={20}/>,
    color: 'bg-orange-100 text-orange-600',
    inputs: ['length'],
    calculate: (i, system) => {
      const spacing = system === 'imperial' ? 1.333 : 0.4;
      const studs = Math.ceil(i.length / spacing) + 2 + Math.ceil(i.length * 0.1); 
      const plates = Math.ceil((i.length * 3) / (system === 'imperial' ? 16 : 4.8)); 
      return [
        { label: `Studs (${system === 'imperial' ? '16" OC' : '40cm OC'})`, value: studs.toString() },
        { label: `Plate Lumber (${system === 'imperial' ? '16ft' : '4.8m'})`, value: plates.toString() }
      ];
    }
  },
  {
    id: 'flooring',
    name: 'Flooring',
    icon: <Box size={20}/>,
    color: 'bg-amber-100 text-amber-600',
    inputs: ['area'],
    calculate: (i, system) => {
      const waste = i.area * 1.1;
      const boxSize = system === 'imperial' ? 20 : 1.86;
      return [
        { label: `Total Area (+10%)`, value: `${Math.ceil(waste)} ${system === 'imperial' ? 'sq ft' : 'm²'}` },
        { label: 'Estimated Boxes', value: Math.ceil(waste / boxSize).toString() }
      ];
    }
  },
  {
      id: 'tile',
      name: 'Tile',
      icon: <Grid size={20}/>,
      color: 'bg-cyan-100 text-cyan-600',
      inputs: ['area'],
      calculate: (i, system) => {
          const waste = i.area * 1.15; 
          const grout = system === 'imperial' ? i.area : i.area * 4; 
          const thinset = system === 'imperial' ? Math.ceil(i.area / 50) : Math.ceil(i.area / 4.5); 

          return [
              { label: `Total Area (+15%)`, value: `${Math.ceil(waste)} ${system === 'imperial' ? 'sq ft' : 'm²'}` },
              { label: 'Thinset Bags', value: thinset.toString() },
              { label: `Grout (${system === 'imperial' ? 'lbs' : 'kg'})`, value: Math.ceil(grout).toString() }
          ];
      }
  },
  {
      id: 'roofing',
      name: 'Roofing',
      icon: <Home size={20}/>,
      color: 'bg-red-100 text-red-600',
      inputs: ['area'],
      calculate: (i, system) => {
          if (system === 'imperial') {
              const squares = Math.ceil((i.area * 1.1) / 100);
              const bundles = squares * 3;
              return [
                  { label: 'Squares (100sqft)', value: squares.toString() },
                  { label: 'Bundles (3/sq)', value: bundles.toString() },
                  { label: 'Felt Rolls', value: Math.ceil(i.area / 400).toString() }
              ];
          } else {
              const bundles = Math.ceil((i.area * 1.1) / 3); 
              return [
                  { label: 'Total Area (+10%)', value: `${(i.area * 1.1).toFixed(1)} m²` },
                  { label: 'Bundles (3m²/ea)', value: bundles.toString() }
              ];
          }
      }
  },
  {
      id: 'insulation',
      name: 'Insulation',
      icon: <Snowflake size={20}/>,
      color: 'bg-pink-100 text-pink-600',
      inputs: ['area'],
      calculate: (i, system) => {
          const bagSize = system === 'imperial' ? 40 : 3.7;
          return [
              { label: 'Batt Insulation Bags', value: Math.ceil(i.area / bagSize).toString() },
              { label: 'Blown-in Bags', value: Math.ceil(i.area / (bagSize * 1.5)).toString() }
          ];
      }
  },
  {
      id: 'mulch',
      name: 'Mulch/Dirt',
      icon: <Shovel size={20}/>,
      color: 'bg-green-100 text-green-600',
      inputs: ['length', 'width', 'depth'],
      calculate: (i, system) => {
          let volume = 0;
          let label = '';
          if (system === 'imperial') {
             const cuFt = i.length * i.width * (i.depth / 12);
             volume = cuFt / 27;
             label = 'Cubic Yards';
             return [
                 { label: label, value: volume.toFixed(2) },
                 { label: '2cf Bags', value: Math.ceil(cuFt / 2).toString() }
             ];
          } else {
             volume = i.length * i.width * (i.depth / 100); 
             label = 'Cubic Meters';
             return [
                 { label: label, value: volume.toFixed(2) },
                 { label: '60L Bags', value: Math.ceil((volume * 1000) / 60).toString() }
             ];
          }
      }
  },
  {
      id: 'decking',
      name: 'Decking',
      icon: <Trello size={20}/>,
      color: 'bg-yellow-100 text-yellow-700',
      inputs: ['area'],
      calculate: (i, system) => {
          const linear = system === 'imperial' ? i.area * 2.1 : i.area * 7; 
          const unit = system === 'imperial' ? 'Linear Ft' : 'Linear M';
          const boards = Math.ceil(linear / (system === 'imperial' ? 12 : 3.6));
          return [
              { label: `Decking (${unit})`, value: Math.ceil(linear).toString() },
              { label: `${system === 'imperial' ? '12ft' : '3.6m'} Boards`, value: boards.toString() },
              { label: 'Screws (approx)', value: Math.ceil(linear * 3.5).toString() } 
          ];
      }
  },
  {
      id: 'hvac',
      name: 'AC / HVAC',
      icon: <Thermometer size={20}/>,
      color: 'bg-indigo-100 text-indigo-600',
      inputs: ['area'],
      calculate: (i, system) => {
          if (system === 'imperial') {
              const btu = i.area * 25;
              const tons = btu / 12000;
              return [
                  { label: 'Cooling Capacity', value: `${Math.ceil(btu/1000)*1000} BTU` },
                  { label: 'Tons (Approx)', value: tons.toFixed(1) }
              ];
          } else {
              const watts = i.area * 140; 
              return [
                  { label: 'Cooling Power', value: `${(watts/1000).toFixed(1)} kW` },
                  { label: 'BTU Equivalent', value: Math.ceil((watts * 3.41)).toString() }
              ];
          }
      }
  }
];

// --- PAYROLL HELPER ---
const getPayPeriods = (anchor: string, freq: string, count = 5) => {
    const periods = [];
    const anchorDate = new Date(anchor);
    const dayMs = 24 * 60 * 60 * 1000;
    const periodDays = freq === 'weekly' ? 7 : freq === 'bi-weekly' ? 14 : 30;
    
    // Find "current" period relative to today to show relevant options
    // For simplicity, we'll just generate backward from Today snapped to the anchor cycle
    
    const today = new Date();
    const daysSinceAnchor = Math.floor((today.getTime() - anchorDate.getTime()) / dayMs);
    const currentPeriodIndex = Math.floor(daysSinceAnchor / periodDays);
    
    // Generate last `count` periods including current
    for (let i = 0; i < count; i++) {
        const idx = currentPeriodIndex - i;
        const start = new Date(anchorDate.getTime() + (idx * periodDays * dayMs));
        const end = new Date(start.getTime() + ((periodDays - 1) * dayMs));
        
        periods.push({
            label: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0],
            isCurrent: i === 0
        });
    }
    return periods;
};

export const BusinessTools: React.FC<ToolsProps> = ({ 
  teamMembers, events, onAddEvent, onDeleteEvent, onAddMember, onDeleteMember, onUpdateMember, projectContext, timeline, onUpdateProjectTimeline, timeLogs = [], onLogTime, business, onUpdateBusiness
}) => {
  const [activeTool, setActiveTool] = useState<'calculator' | 'calendar' | 'team' | 'timeline' | 'safety'>('calculator');
  
  // Calculator State
  const [activeCalc, setActiveCalc] = useState<CalculatorType>('drywall');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [inputs, setInputs] = useState<any>({ area: 0, length: 0, width: 0, depth: 0, height: 0, coats: 2 });
  const [results, setResults] = useState<{label: string, value: string}[]>([]);

  // Calendar State
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({ type: 'job_start', time: '09:00' });

  // Safety Checklist State
  const [safetyChecklist, setSafetyChecklist] = useState<string[]>([]);
  const [loadingSafety, setLoadingSafety] = useState(false);

  // Team State
  const [teamView, setTeamView] = useState<'roster' | 'timesheet' | 'payroll_settings'>('roster');
  const [newTimeLog, setNewTimeLog] = useState<{
      memberId: string;
      date: string;
      startTime: string;
      endTime: string;
      hours: string;
      description: string;
  }>({ 
      memberId: '', 
      date: new Date().toISOString().split('T')[0], 
      startTime: '', 
      endTime: '', 
      hours: '', 
      description: '' 
  });

  // Payroll Filter State
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all'); // 'all' or 'start_date|end_date'

  const handleCalculate = () => {
    const calc = CALCULATORS.find(c => c.id === activeCalc);
    if (calc) {
      setResults(calc.calculate(inputs, unitSystem));
    }
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date) {
      onAddEvent({
        id: uuidv4(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time || '09:00',
        type: newEvent.type as any || 'job_start',
        clientName: projectContext?.clientName,
        invoiceId: projectContext?.id
      });
      setNewEvent({ type: 'job_start', title: '', date: '', time: '09:00' });
    }
  };

  const handleGenerateSafety = async () => {
     if (!projectContext) return;
     setLoadingSafety(true);
     const list = await generateSafetyChecklist(projectContext.title);
     setSafetyChecklist(list);
     setLoadingSafety(false);
  };

  // Auto-calculate hours if start/end set
  useEffect(() => {
    if (newTimeLog.startTime && newTimeLog.endTime) {
      const start = new Date(`2000-01-01T${newTimeLog.startTime}`);
      const end = new Date(`2000-01-01T${newTimeLog.endTime}`);
      if (end > start) {
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        setNewTimeLog(prev => ({ ...prev, hours: diff.toFixed(2) }));
      }
    }
  }, [newTimeLog.startTime, newTimeLog.endTime]);

  const handleLogTime = () => {
     if (!onLogTime || !newTimeLog.memberId || !newTimeLog.hours) return;
     const member = teamMembers.find(m => m.id === newTimeLog.memberId);
     if (!member) return;

     const hours = parseFloat(newTimeLog.hours);
     const rate = member.hourlyRate || 0;

     onLogTime({
         id: uuidv4(),
         projectId: projectContext?.id || '',
         memberId: member.id,
         memberName: member.name,
         date: newTimeLog.date,
         startTime: newTimeLog.startTime,
         endTime: newTimeLog.endTime,
         hours: hours,
         description: newTimeLog.description || 'General Labor',
         cost: hours * rate
     });
     // Reset fields but keep member and date to enable quick logging
     setNewTimeLog({ ...newTimeLog, startTime: '', endTime: '', hours: '', description: '' });
  };

  const handleSavePayrollSettings = (settings: PayrollSettings) => {
      if (business && onUpdateBusiness) {
          onUpdateBusiness({ ...business, payrollSettings: settings });
          setTeamView('timesheet'); // Go back to timesheet
      }
  };

  // --- TIMELINE HANDLERS ---
  // ... (Timeline handlers remain the same)
  const handleInitTimeline = () => {
    if (!onUpdateProjectTimeline || !projectContext) return;
    const newTimeline: JobTimeline = {
        id: uuidv4(),
        title: "Project Timeline",
        projectId: projectContext.id,
        startDate: projectContext.startDate,
        stages: [
            { id: uuidv4(), name: "Planning & Prep", description: "", status: 'current', date: projectContext.startDate },
            { id: uuidv4(), name: "Materials", description: "", status: 'pending', date: "" },
            { id: uuidv4(), name: "Execution", description: "", status: 'pending', date: "" },
            { id: uuidv4(), name: "Completion", description: "", status: 'pending', date: "" }
        ]
    };
    onUpdateProjectTimeline(newTimeline);
  };

  const handleAddStage = () => {
    if (!timeline || !onUpdateProjectTimeline) return;
    const newStage: TimelineStage = {
        id: uuidv4(),
        name: "New Phase",
        description: "",
        status: 'pending',
        date: ""
    };
    onUpdateProjectTimeline({ ...timeline, stages: [...timeline.stages, newStage] });
  };

  const updateStage = (id: string, updates: Partial<TimelineStage>) => {
    if (!timeline || !onUpdateProjectTimeline) return;
    const newStages = timeline.stages.map(s => s.id === id ? { ...s, ...updates } : s);
    onUpdateProjectTimeline({ ...timeline, stages: newStages });
  };

  const deleteStage = (id: string) => {
    if (!timeline || !onUpdateProjectTimeline) return;
    const newStages = timeline.stages.filter(s => s.id !== id);
    onUpdateProjectTimeline({ ...timeline, stages: newStages });
  };

  const cycleStageStatus = (id: string) => {
      if (!timeline) return;
      const stage = timeline.stages.find(s => s.id === id);
      if (!stage) return;
      
      let nextStatus: TimelineStage['status'] = 'pending';
      if (stage.status === 'pending') nextStatus = 'current';
      else if (stage.status === 'current') nextStatus = 'completed';
      else nextStatus = 'pending';
      
      updateStage(id, { status: nextStatus });
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'completed': return 'bg-emerald-500 text-white border-emerald-500';
          case 'current': return 'bg-white text-brand-600 border-brand-500 ring-4 ring-brand-100';
          default: return 'bg-slate-100 text-slate-400 border-slate-200';
      }
  };

  // Filter Logs Logic
  const getFilteredLogs = () => {
      if (selectedPeriod === 'all') return timeLogs;
      const [start, end] = selectedPeriod.split('|');
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      return timeLogs.filter(l => {
          const d = new Date(l.date);
          return d >= startDate && d <= endDate;
      });
  };

  const filteredLogs = getFilteredLogs();
  const periodTotalHours = filteredLogs.reduce((sum, l) => sum + l.hours, 0);
  const periodTotalCost = filteredLogs.reduce((sum, l) => sum + l.cost, 0);

  // Generate Periods if settings exist
  const payPeriods = (business?.payrollSettings) 
      ? getPayPeriods(business.payrollSettings.anchorDate, business.payrollSettings.frequency) 
      : [];

  return (
    <div className="flex flex-col md:flex-row h-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
       {/* Tools Sidebar */}
       <div className="w-full md:w-48 bg-slate-50 border-r border-slate-200 p-2 flex md:flex-col gap-2 overflow-x-auto">
          <button onClick={() => setActiveTool('calculator')} className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap ${activeTool === 'calculator' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
             <Calculator size={18}/> Calculator
          </button>
          <button onClick={() => setActiveTool('calendar')} className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap ${activeTool === 'calendar' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
             <Calendar size={18}/> Schedule
          </button>
          <button onClick={() => setActiveTool('team')} className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap ${activeTool === 'team' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
             <Users size={18}/> Crew
          </button>
          <button onClick={() => setActiveTool('timeline')} className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap ${activeTool === 'timeline' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
             <LayoutTemplate size={18}/> Timeline
          </button>
          <button onClick={() => setActiveTool('safety')} className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap ${activeTool === 'safety' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
             <ShieldCheck size={18}/> Safety
          </button>
       </div>

       <div className="flex-1 p-6 overflow-y-auto">
          {activeTool === 'calculator' && (
             <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Construction Calculator</h3>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => { setUnitSystem('imperial'); setResults([]); }} 
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${unitSystem === 'imperial' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`}
                        >
                            Imperial (US)
                        </button>
                        <button 
                            onClick={() => { setUnitSystem('metric'); setResults([]); }} 
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${unitSystem === 'metric' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`}
                        >
                            Metric
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                   {CALCULATORS.map(calc => (
                      <button key={calc.id} onClick={() => { setActiveCalc(calc.id); setResults([]); }} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${activeCalc === calc.id ? `border-brand-500 ring-2 ring-brand-100 ${calc.color}` : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                         {calc.icon}
                         <span className="text-[10px] font-bold uppercase">{calc.name}</span>
                      </button>
                   ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <div className="grid grid-cols-2 gap-4 mb-4">
                      {CALCULATORS.find(c => c.id === activeCalc)?.inputs.map(input => (
                         <div key={input}>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{getLabel(input, unitSystem)}</label>
                            <input type="number" value={inputs[input]} onChange={e => setInputs({...inputs, [input]: parseFloat(e.target.value)})} className="w-full p-2 border border-slate-300 rounded-lg" />
                         </div>
                      ))}
                   </div>
                   <Button onClick={handleCalculate} className="w-full">Calculate</Button>
                </div>

                {results.length > 0 && (
                   <div className="grid grid-cols-2 gap-4 animate-slide-up">
                      {results.map((res, idx) => (
                         <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                            <div className="text-2xl font-bold text-slate-900">{res.value}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase">{res.label}</div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          )}

          {activeTool === 'calendar' && (
             <div className="h-full flex flex-col animate-fade-in">
                 {/* Calendar Content (Same as previous) */}
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Job Schedule</h3>
                 </div>
                 <div className="flex gap-2 mb-6 flex-wrap">
                    <input type="date" value={newEvent.date || ''} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="p-2 border rounded text-sm" />
                    <input type="time" value={newEvent.time || ''} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="p-2 border rounded text-sm" />
                    <input type="text" placeholder="Event Title" value={newEvent.title || ''} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="p-2 border rounded text-sm w-40 flex-grow" />
                    <Button size="sm" onClick={handleCreateEvent} icon={<Plus size={16}/>}>Add</Button>
                 </div>
                 <div className="space-y-3">
                    {events.length === 0 && <div className="text-center text-slate-400 py-8">No events scheduled.</div>}
                    {events.map(evt => (
                       <div key={evt.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-brand-300 transition-all">
                          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold ${evt.type === 'deadline' ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
                             <span className="text-xs">{new Date(evt.date).getDate()}</span>
                             <span className="text-[10px] uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                          </div>
                          <div className="flex-1">
                             <div className="font-bold text-slate-900">{evt.title}</div>
                             <div className="text-xs text-slate-500 capitalize">{evt.type.replace('_', ' ')} • {evt.time}</div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteEvent(evt.id);
                            }}
                            className="text-slate-300 hover:text-red-500 transition-colors p-3 z-10"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                 </div>
             </div>
          )}

          {activeTool === 'team' && (
             <div className="animate-fade-in space-y-6">
                {/* Team Header & Navigation */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Crew Management</h3>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                       <button onClick={() => setTeamView('roster')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${teamView === 'roster' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`}>Roster</button>
                       <button onClick={() => setTeamView('timesheet')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${teamView === 'timesheet' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`}>Time Sheets</button>
                       {business && <button onClick={() => setTeamView('payroll_settings')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${teamView === 'payroll_settings' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`} title="Payroll Settings"><Settings size={14}/></button>}
                    </div>
                </div>
                
                {teamView === 'payroll_settings' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Settings size={18}/> Payroll Configuration</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Frequency</label>
                                <select 
                                    id="payFreq"
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                    defaultValue={business?.payrollSettings?.frequency || 'weekly'}
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="bi-weekly">Bi-Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Start Date (Anchor)</label>
                                <input 
                                    type="date" 
                                    id="payAnchor"
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                    defaultValue={business?.payrollSettings?.anchorDate || new Date().toISOString().split('T')[0]}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Choose the first day of a recent pay period.</p>
                            </div>
                            <div className="pt-2 flex gap-2">
                                <Button size="sm" onClick={() => {
                                    const freq = (document.getElementById('payFreq') as HTMLSelectElement).value as any;
                                    const anchor = (document.getElementById('payAnchor') as HTMLInputElement).value;
                                    handleSavePayrollSettings({ frequency: freq, anchorDate: anchor });
                                }}>Save Settings</Button>
                                <Button size="sm" variant="ghost" onClick={() => setTeamView('timesheet')}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                )}

                {teamView === 'roster' && (
                   <>
                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => onAddMember({ id: uuidv4(), name: '', role: 'member', email: '', status: 'active', hourlyRate: 0, specialty: 'General', currentStatus: 'available' })} icon={<Plus size={16}/>}>Add Member</Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                         {teamMembers.map(member => (
                            <div key={member.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                               <div className="flex items-center gap-3 flex-1">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-lg">{member.name ? member.name.charAt(0) : <Users size={20} />}</div>
                                  <div>
                                     <input 
                                        value={member.name} 
                                        onChange={(e) => onUpdateMember && onUpdateMember({...member, name: e.target.value})}
                                        className="font-bold text-slate-900 text-base bg-transparent outline-none border-b border-transparent focus:border-brand-300 w-full" 
                                        placeholder="Enter Name"
                                     />
                                     <div className="flex items-center gap-2 mt-1">
                                         <input 
                                            value={member.specialty || ''} 
                                            onChange={(e) => onUpdateMember && onUpdateMember({...member, specialty: e.target.value})}
                                            className="text-xs text-slate-500 bg-slate-50 rounded px-1 outline-none border border-transparent hover:border-slate-200 w-24 transition-all focus:bg-white focus:border-brand-300"
                                            placeholder="Trade/Role"
                                         />
                                         <span className="text-slate-300">•</span>
                                         <div className="flex items-center text-xs text-slate-600">
                                            <DollarSign size={10} />
                                            <input 
                                                type="number"
                                                value={member.hourlyRate || ''} 
                                                onChange={(e) => onUpdateMember && onUpdateMember({...member, hourlyRate: parseFloat(e.target.value)})}
                                                className="w-12 bg-transparent outline-none border-b border-slate-200 text-center"
                                                placeholder="0"
                                            />
                                            <span className="text-[10px] text-slate-400">/hr</span>
                                         </div>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="flex items-center gap-3 md:border-l md:border-slate-100 md:pl-4">
                                  {/* Status Toggle */}
                                  <select 
                                    value={member.currentStatus || 'off'}
                                    onChange={(e) => onUpdateMember && onUpdateMember({...member, currentStatus: e.target.value as any})}
                                    className={`text-xs font-bold px-2 py-1 rounded-full outline-none appearance-none cursor-pointer text-center w-24 ${
                                        member.currentStatus === 'on_site' ? 'bg-green-100 text-green-700' : 
                                        member.currentStatus === 'available' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                      <option value="on_site">On Site</option>
                                      <option value="available">Available</option>
                                      <option value="off">Off Duty</option>
                                  </select>

                                  {onDeleteMember && (
                                      <button
                                          type="button"
                                          onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              onDeleteMember(member.id);
                                          }}
                                          className="text-slate-300 hover:text-red-500 p-2 hover:bg-slate-50 rounded-full"
                                      >
                                          <Trash2 size={16}/>
                                      </button>
                                  )}
                               </div>
                            </div>
                         ))}
                      </div>
                   </>
                )}

                {teamView === 'timesheet' && (
                    <div className="space-y-6">
                        {/* Time Entry Form */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2"><Clock size={14}/> Log Time for Project: {projectContext?.title}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Crew Member</label>
                                    <select 
                                        value={newTimeLog.memberId}
                                        onChange={(e) => setNewTimeLog({...newTimeLog, memberId: e.target.value})}
                                        className="p-2 border border-slate-300 rounded-lg text-sm bg-white w-full"
                                    >
                                        <option value="">Select...</option>
                                        {/* Filter out members with no name and sort alphabetically */}
                                        {teamMembers
                                            .filter(m => m.name && m.name.trim() !== '' && m.name !== 'New Member')
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map(m => <option key={m.id} value={m.id}>{m.name} ({m.specialty || 'General'})</option>)
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date</label>
                                    <input 
                                        type="date"
                                        value={newTimeLog.date}
                                        onChange={(e) => setNewTimeLog({...newTimeLog, date: e.target.value})}
                                        className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Time In / Out</label>
                                    <div className="flex gap-1 items-center">
                                        <input 
                                            type="time" 
                                            value={newTimeLog.startTime}
                                            onChange={(e) => setNewTimeLog({...newTimeLog, startTime: e.target.value})}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                                        />
                                        <span className="text-slate-400">-</span>
                                        <input 
                                            type="time" 
                                            value={newTimeLog.endTime}
                                            onChange={(e) => setNewTimeLog({...newTimeLog, endTime: e.target.value})}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Total Hours</label>
                                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-2">
                                        <input 
                                            type="number" 
                                            placeholder="0.0" 
                                            value={newTimeLog.hours}
                                            onChange={(e) => setNewTimeLog({...newTimeLog, hours: e.target.value})}
                                            className="w-full p-2 text-sm outline-none"
                                        />
                                        <span className="text-xs text-slate-500 font-bold">HRS</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Work Description</label>
                                    <input 
                                        type="text" 
                                        placeholder="What was done? (e.g. Framing Wall A)" 
                                        value={newTimeLog.description}
                                        onChange={(e) => setNewTimeLog({...newTimeLog, description: e.target.value})}
                                        className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button size="sm" onClick={handleLogTime} disabled={!newTimeLog.memberId || !newTimeLog.hours}>Log Time</Button>
                                </div>
                            </div>
                        </div>

                        {/* Payroll Filter Header */}
                        <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                            <div>
                                <h4 className="font-bold text-slate-900">Logged Hours</h4>
                                <p className="text-xs text-slate-500">
                                    {selectedPeriod === 'all' ? 'All Time' : 'Selected Period'} • Total Cost: <span className="font-bold text-emerald-600">${periodTotalCost.toFixed(2)}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-500">Pay Period:</label>
                                <select 
                                    value={selectedPeriod} 
                                    onChange={e => setSelectedPeriod(e.target.value)}
                                    className="p-1.5 border border-slate-300 rounded text-xs bg-white outline-none"
                                >
                                    <option value="all">All Time</option>
                                    {payPeriods.map(p => (
                                        <option key={p.start} value={`${p.start}|${p.end}`}>
                                            {p.isCurrent ? '(Current) ' : ''}{p.label}
                                        </option>
                                    ))}
                                </select>
                                {payPeriods.length === 0 && (
                                    <button onClick={() => setTeamView('payroll_settings')} className="text-xs text-brand-600 underline font-medium ml-1">Setup Payroll</button>
                                )}
                            </div>
                        </div>

                        {/* Logs List - Grouped by Worker */}
                        <div className="space-y-6">
                            {(!filteredLogs || filteredLogs.length === 0) ? (
                                <div className="p-8 text-center text-slate-400 text-sm italic bg-white border border-slate-200 rounded-xl">No time logged for this period.</div>
                            ) : (
                                <>
                                    {/* Group by Worker, Sort Workers Alphabetically, Sort Logs by Date Ascending */}
                                    {Array.from(new Set(filteredLogs.map(l => l.memberId)))
                                        .map(id => teamMembers.find(m => m.id === id))
                                        .filter(m => m !== undefined)
                                        .sort((a, b) => a!.name.localeCompare(b!.name))
                                        .map(member => {
                                            const memberLogs = filteredLogs
                                                .filter(l => l.memberId === member!.id)
                                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                            
                                            const totalHrs = memberLogs.reduce((sum, l) => sum + l.hours, 0);
                                            const totalCost = memberLogs.reduce((sum, l) => sum + l.cost, 0);

                                            return (
                                                <div key={member!.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                                    <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                                {member!.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 text-sm">{member!.name}</div>
                                                                <div className="text-[10px] text-slate-500 uppercase">{member!.specialty || 'General'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs font-bold text-slate-900">{totalHrs.toFixed(2)} Hrs Total</div>
                                                            <div className="text-[10px] text-emerald-600 font-medium">${totalCost.toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-white">
                                                        <div className="grid grid-cols-6 text-[10px] font-bold text-slate-400 uppercase p-2 border-b border-slate-100 bg-slate-50/50">
                                                            <span className="col-span-1 pl-2">Date</span>
                                                            <span className="col-span-1">Time</span>
                                                            <span className="col-span-3">Description</span>
                                                            <span className="col-span-1 text-right pr-2">Hours</span>
                                                        </div>
                                                        {memberLogs.map(log => (
                                                            <div key={log.id} className="grid grid-cols-6 text-sm p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors items-center">
                                                                <div className="col-span-1 text-slate-600 font-medium pl-2">
                                                                    {new Date(log.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                                                </div>
                                                                <div className="col-span-1 text-xs text-slate-400">
                                                                    {log.startTime ? `${log.startTime}-${log.endTime}` : '-'}
                                                                </div>
                                                                <div className="col-span-3 text-slate-800 truncate pr-2">
                                                                    {log.description || <span className="text-slate-300 italic">No description</span>}
                                                                </div>
                                                                <div className="col-span-1 text-right font-bold text-slate-700 pr-2">
                                                                    {log.hours}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </>
                            )}
                        </div>
                    </div>
                )}
             </div>
          )}
          
          {activeTool === 'safety' && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-slate-900">AI Safety Checklist</h3>
                   <Button size="sm" onClick={handleGenerateSafety} isLoading={loadingSafety} icon={<ShieldCheck size={16}/>}>Generate</Button>
                </div>
                <div className="space-y-2">
                   {safetyChecklist.length === 0 && !loadingSafety && <div className="text-slate-400 text-sm italic">Click Generate to create a site-specific safety plan based on your project scope.</div>}
                   {safetyChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                         <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5"/>
                         <span className="text-sm text-green-800">{item}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTool === 'timeline' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Project Timeline</h3>
                    <Button size="sm" onClick={handleAddStage} icon={<Plus size={16}/>}>Add Phase</Button>
                </div>

                {!timeline ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <Clock size={48} className="mx-auto mb-4 text-brand-200"/>
                        <h4 className="font-bold text-slate-700 mb-2">No Timeline Set</h4>
                        <p className="text-slate-400 text-sm mb-6">Start tracking project phases and milestones.</p>
                        <Button onClick={handleInitTimeline}>Create Default Timeline</Button>
                    </div>
                ) : (
                    <div className="relative space-y-0 pb-8">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-4 bottom-0 w-0.5 bg-slate-200 z-0"></div>
                        
                        {timeline.stages.map((stage, idx) => (
                            <div key={stage.id} className="relative z-10 flex gap-4 group">
                                {/* Status Icon */}
                                <button 
                                    onClick={() => cycleStageStatus(stage.id)}
                                    className={`w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 transition-all ${getStatusColor(stage.status)}`}
                                    title="Click to change status"
                                >
                                    {stage.status === 'completed' ? <Check size={20}/> : <span className="font-bold">{idx + 1}</span>}
                                </button>

                                {/* Content Card */}
                                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <input 
                                            value={stage.name || ''}
                                            onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                                            className="font-bold text-slate-900 bg-transparent outline-none focus:bg-slate-50 rounded px-1 w-full"
                                            placeholder="Phase Name"
                                        />
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                deleteStage(stage.id);
                                            }} 
                                            className="text-slate-300 hover:text-red-500 p-1"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                    <textarea 
                                        value={stage.description || ''}
                                        onChange={(e) => updateStage(stage.id, { description: e.target.value })}
                                        placeholder="Add details..."
                                        className="w-full text-xs text-slate-500 bg-transparent border border-transparent hover:border-slate-200 focus:bg-slate-50 rounded p-1 resize-none outline-none mb-2"
                                        rows={2}
                                    />
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 block">Target Date</label>
                                            <input 
                                                type="date" 
                                                value={stage.date || ''} 
                                                onChange={(e) => updateStage(stage.id, { date: e.target.value })}
                                                className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 block">Status</label>
                                            <select 
                                                value={stage.status || 'pending'}
                                                onChange={(e) => updateStage(stage.id, { status: e.target.value as any })}
                                                className="text-slate-600 bg-transparent outline-none w-full capitalize cursor-pointer"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="current">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}
       </div>
    </div>
  );
};
