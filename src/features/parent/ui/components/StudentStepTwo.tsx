import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Subject } from '../../../../types';

interface StudentStepTwoProps {
  courseType: 'INDIVIDUEL' | 'GROUPE';
  selectedSubjects: string[];
  subjects: Subject[];
  onChange: (field: string, val: any) => void;
  onToggleSubject: (id: string) => void;
}

export function StudentStepTwo({
  courseType, selectedSubjects, subjects, onChange, onToggleSubject
}: StudentStepTwoProps) {
  return (
    <div className="space-y-3 text-left animate-in fade-in duration-150">
      <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest block">Étape 2 sur 2 : Matières & Type</span>
      <div>
        <label className="text-[10px] font-bold text-slate-500 block mb-1">Type de cours souhaité</label>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onChange('courseType', 'GROUPE')} className={`p-2.5 rounded-xl border font-bold transition text-left leading-normal ${courseType === 'GROUPE' ? 'bg-sky-50 border-sky-300 text-sky-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <span className="block font-black text-[11px]">En Groupe</span>
            <span className="text-[9px] text-slate-400 font-normal">Cours de soutien en groupe</span>
          </button>
          <button onClick={() => onChange('courseType', 'INDIVIDUEL')} className={`p-2.5 rounded-xl border font-bold transition text-left leading-normal ${courseType === 'INDIVIDUEL' ? 'bg-sky-50 border-sky-300 text-sky-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <span className="block font-black text-[11px]">Individuel</span>
            <span className="text-[9px] text-slate-400 font-normal">À domicile / Sur mesure</span>
          </button>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-500 block mb-1">Matières souhaitées</label>
        <div className="grid grid-cols-2 gap-2">
          {subjects.filter(s => s.active).map(sub => (
            <button key={sub.id} onClick={() => onToggleSubject(sub.id)} className={`p-2 rounded-xl border font-bold transition text-left truncate ${selectedSubjects.includes(sub.id) ? 'bg-sky-500 border-sky-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{sub.name}</button>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex gap-2.5 items-start">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-700 font-medium leading-relaxed">Cette inscription sera envoyée à l'équipe administrative pour validation. Vous recevrez une notification dès sa confirmation.</p>
      </div>
    </div>
  );
}
