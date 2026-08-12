import React from 'react';
import { TrendingUp, ArrowDownRight, PiggyBank } from 'lucide-react';

interface TreasuryReportCardProps {
  totalRevenus: number;
  totalSalaires: number;
  benefice: number;
}

export function TreasuryReportCard({ totalRevenus, totalSalaires, benefice }: TreasuryReportCardProps) {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      <h3 className="font-display font-extrabold text-xs mb-4 text-sky-400 uppercase tracking-widest">
        Rapport de Trésorerie Mensuelle
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 flex flex-col justify-between gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
              Paiements reçus
            </span>
            <div className="p-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-sm font-extrabold text-emerald-400 font-mono truncate">
            {totalRevenus.toLocaleString()} FCFA
          </span>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 flex flex-col justify-between gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
              Salaires
            </span>
            <div className="p-1.5 bg-rose-500/15 text-rose-400 rounded-lg shrink-0">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <span className="text-sm font-extrabold text-rose-400 font-mono truncate">
            {totalSalaires.toLocaleString()} FCFA
          </span>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 flex flex-col justify-between gap-2 min-w-0 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
              Bénéfice net
            </span>
            <div className="p-1.5 bg-sky-500/15 text-sky-400 rounded-lg shrink-0">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <span className={`text-sm font-extrabold font-mono truncate ${benefice >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
            {benefice.toLocaleString()} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}
