import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SchoolCycle } from '../../../types';
import { CycleIcon } from './CycleIcon';

interface CardProps {
  cyc: SchoolCycle;
  firstLvlId: string;
  isPaused: boolean;
  onSelectOffer?: (offer: any) => void;
}

export const CycleTarifCard: React.FC<CardProps> = ({ cyc, firstLvlId, isPaused, onSelectOffer }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={() => !isPaused && onSelectOffer?.({ type: 'GROUPE', levelId: '', subjectId: 'sub-general', cycleId: cyc.id })}
      className={`bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between relative group shadow-sm hover:shadow-xl ${
        isPaused ? 'opacity-60 border-slate-100 cursor-not-allowed' : 'border-slate-200 hover:border-sky-500 hover:-translate-y-1 cursor-pointer'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-50 group-hover:bg-sky-100 text-sky-600 rounded-2xl transition duration-300">
            <CycleIcon name={cyc.name} code={cyc.code} size="lg" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-sky-700 transition">{cyc.name}</h4>
            <p className="text-[10px] text-sky-600 font-extrabold uppercase tracking-wider">Formule Groupe (En Classe)</p>
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] text-slate-600 font-medium">
          Niveaux : <strong className="text-slate-800">{cyc.levels.join(', ')}</strong>
        </div>
        <ul className="space-y-1.5 pt-1">
          <li className="flex items-center gap-2 text-slate-700 font-semibold text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Frais d'inscription : <strong>{cyc.registrationFee.toLocaleString('fr-FR')} FCFA</strong></span>
          </li>
          <li className="flex items-center gap-2 text-slate-600 font-medium text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Salles modernes & 12 élèves max</span>
          </li>
          <li className="flex items-center gap-2 text-slate-600 font-medium text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Suivi rigoureux & prépa examens</span>
          </li>
        </ul>
      </div>
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-base font-black text-slate-900">{cyc.monthlyFee.toLocaleString('fr-FR')} FCFA <span className="text-[10px] text-slate-400 font-normal">/ mois</span></div>
        <div className="flex items-center gap-1 text-sky-600 font-bold text-[11px] group-hover:translate-x-1 transition duration-200">
          <span>S'inscrire</span>
          <div className="w-6 h-6 rounded-full bg-sky-50 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center text-sky-600 transition duration-200">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
