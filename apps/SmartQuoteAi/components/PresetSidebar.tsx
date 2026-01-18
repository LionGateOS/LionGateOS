import React from 'react';
import { BundlePreset, ScopePreset, TradePreset } from '../core/presets';
import { Button } from './Button';
import { Package, Layers, Sparkles } from 'lucide-react';

interface PresetSidebarProps {
  trades: TradePreset[];
  scopes: ScopePreset[];
  bundles: BundlePreset[];
  onApplyScope: (scope: ScopePreset) => void;
  onApplyBundle: (bundle: BundlePreset) => void;
  onApplyTrade: (trade: TradePreset) => void;
}

export const PresetSidebar: React.FC<PresetSidebarProps> = ({
  trades,
  scopes,
  bundles,
  onApplyScope,
  onApplyBundle,
  onApplyTrade,
}) => {
  return (
    <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800/60 bg-slate-950/40 backdrop-blur-sm flex-shrink-0">
      <div className="h-full flex flex-col">
        <div className="px-4 pt-4 pb-3 border-b border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Presets & Bundles
            </div>
            <div className="text-sm text-slate-200">
              Speed up your estimating
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 p-3 md:p-4 text-sm">
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="font-medium text-slate-100 text-xs uppercase tracking-wide">
                Trades
              </h3>
            </div>
            <div className="space-y-1">
              {trades.slice(0, 8).map((trade) => (
                <button
                  key={trade.id}
                  type="button"
                  onClick={() => onApplyTrade(trade)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-100 text-xs flex items-center justify-between"
                >
                  <span>{trade.label}</span>
                  {trade.defaultDetailLevel && (
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">
                      {trade.defaultDetailLevel}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <h3 className="font-medium text-slate-100 text-xs uppercase tracking-wide">
                Bundles
              </h3>
            </div>
            <div className="space-y-1">
              {bundles.slice(0, 6).map((bundle) => (
                <button
                  key={bundle.id}
                  type="button"
                  onClick={() => onApplyBundle(bundle)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-100 text-xs"
                >
                  <div className="font-medium">{bundle.label}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {bundle.descriptionTemplate}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <h3 className="font-medium text-slate-100 text-xs uppercase tracking-wide">
                Suggested scopes
              </h3>
            </div>
            <div className="space-y-1">
              {scopes.slice(0, 8).map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => onApplyScope(scope)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-100 text-xs"
                >
                  <div className="font-medium">{scope.label}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {scope.descriptionTemplate}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-slate-800/60 px-3 md:px-4 py-3 text-[11px] text-slate-500">
          Presets are local to this device for now. Cloud sync is coming in a later phase.
        </div>
      </div>
    </aside>
  );
};
