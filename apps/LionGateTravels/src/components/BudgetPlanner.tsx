import React, { useState } from 'react';
import { Calendar, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const BudgetPlanner: React.FC = () => {
  const [duration, setDuration] = useState(7);
  const [dailyBudget, setDailyBudget] = useState(300);
  const [hotelPrice, setHotelPrice] = useState(250);

  const totalBudget = duration * dailyBudget;
  const hotelCost = duration * hotelPrice;
  const remainingBudget = totalBudget - hotelCost;
  const budgetUsedPercent = (hotelCost / totalBudget) * 100;

  return (
    <div className="glass-panel rounded-xl p-4 neon-border-cyan space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-gradient-cyan uppercase tracking-wider">Budget Planner</h3>
        </div>
        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
          <Target className="w-3 h-3 mr-1" />
          ACTIVE
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-white/50 uppercase">Duration</span>
            <span className="text-sm font-bold text-cyan-400">{duration} Days</span>
          </div>
          <Slider value={[duration]} min={1} max={30} step={1} onValueChange={(v) => setDuration(v[0])} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-white/50 uppercase">Daily Budget</span>
            <span className="text-sm font-bold text-yellow-400">${dailyBudget}</span>
          </div>
          <Slider value={[dailyBudget]} min={50} max={2000} step={50} onValueChange={(v) => setDailyBudget(v[0])} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-white/50 uppercase">Hotel/Night</span>
            <span className="text-sm font-bold text-fuchsia-400">${hotelPrice}</span>
          </div>
          <Slider value={[hotelPrice]} min={50} max={1000} step={10} onValueChange={(v) => setHotelPrice(v[0])} />
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-white/50 uppercase">Total Budget</div>
            <div className="text-2xl font-black text-white">${totalBudget.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/50 uppercase">Remaining</div>
            <div className={`text-2xl font-black ${remainingBudget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${remainingBudget.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" 
            style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
