import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface TarifCardProps {
  format: {
    type: 'GROUPE' | 'INDIVIDUEL';
    name: string;
    subtitle: string;
    desc: string;
    price: string;
    paused: boolean;
    icon: any;
    color: string;
    feats: string[];
  };
  levelId: string;
  subjectId: string;
  onSelectOffer?: (offer: any) => void;
}

export const TarifCard: React.FC<TarifCardProps> = ({ format, levelId, subjectId, onSelectOffer }) => {
  const Icon = format.icon;
  const isAmber = format.color === 'amber';
  return (
    <div 
      onClick={() => !format.paused && onSelectOffer?.({ type: format.type, levelId, subjectId })}
      className={`bg-white rounded-3xl p-4 border transition duration-200 flex flex-col justify-between relative group ${
        format.paused ? 'opacity-60 border-slate-100 cursor-not-allowed' : `border-slate-200 hover:border-${isAmber ? 'amber' : 'sky'}-400 hover:shadow-lg cursor-pointer`
      }`}
    >
      {format.paused && <div className="absolute top-3 right-3 bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">Complet</div>}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isAmber ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}><Icon className="w-4 h-4" /></div>
          <div>
            <h4 className="font-display font-black text-slate-800 text-xs sm:text-sm leading-snug">{format.name}</h4>
            <p className="text-[9px] text-slate-400 font-bold">{format.subtitle}</p>
          </div>
        </div>
        <p className="text-slate-500 leading-relaxed text-[10px] font-medium">{format.desc}</p>
        <ul className="space-y-1">
          {format.feats.map((feat, i) => (
            <li key={i} className="flex items-center gap-1 text-slate-600 font-medium text-[9px]">
              <CheckCircle2 className={`w-3 h-3 shrink-0 ${isAmber ? 'text-amber-500' : 'text-sky-500'}`} />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight">{format.price} <span className="text-[9px] text-slate-400 font-semibold">/ mois</span></div>
        <div className="flex items-center gap-1">
          <span className={`text-[9px] font-bold ${format.paused ? 'text-slate-400' : isAmber ? 'text-amber-500' : 'text-sky-500'}`}>{format.paused ? 'Complet' : "S'inscrire"}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition ${format.paused ? 'bg-slate-100 text-slate-300' : `bg-slate-50 group-hover:bg-${isAmber ? 'amber-500' : 'sky-500'} group-hover:text-white text-slate-400`}`}><ArrowRight className="w-3 h-3" /></div>
        </div>
      </div>
    </div>
  );
};
