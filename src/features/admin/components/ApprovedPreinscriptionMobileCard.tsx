import React from 'react';
import { Check, Calendar, User, BookOpen } from 'lucide-react';
import { Preinscription, Level } from '../../../types';

interface ApprovedPreinscriptionMobileCardProps {
  preinscription: Preinscription;
  levelName?: string;
}

export const ApprovedPreinscriptionMobileCard: React.FC<ApprovedPreinscriptionMobileCardProps> = ({
  preinscription,
  levelName,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-3 hover:border-emerald-200 transition-all text-xs">
      <div className="flex justify-between items-center">
        <h5 className="font-bold text-slate-800 text-sm">
          {preinscription.studentFirstName} {preinscription.studentLastName}
        </h5>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-600 border border-sky-100">
          {levelName || 'N/A'}
        </span>
      </div>

      <div className="space-y-1 text-[11px] text-slate-600">
        <p className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Parent: {preinscription.parentName}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Le {new Date(preinscription.date).toLocaleDateString('fr-FR')}</span>
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span className="font-medium text-slate-400">Type: {preinscription.courseType}</span>
        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <Check className="w-3.5 h-3.5" /> Validé
        </span>
      </div>
    </div>
  );
};
