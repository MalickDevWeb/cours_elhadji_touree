import React from 'react';
import { Level } from '../../../types';
import { User, Calendar } from 'lucide-react';
import { StudentFormErrors } from './enrollmentValidation';

interface StudentStepProps {
  levels: Level[];
  student: { firstName: string; lastName: string; sex: 'M' | 'F'; birthDate: string; levelId: string };
  setStudent: (s: any) => void;
  errors: StudentFormErrors;
}

export const EnrollmentStudentStep: React.FC<StudentStepProps> = ({ levels, student, setStudent, errors }) => {
  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5 pb-1">
        <span className="w-1.5 h-3 bg-sky-500 rounded-full" />
        <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Informations Élève</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Prénom de l'élève</label>
          <div className="relative flex items-center">
            <User className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input 
              type="text" placeholder="Ex: Babacar" value={student.firstName} 
              onChange={e => setStudent({...student, firstName: e.target.value})} 
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs outline-none transition-all duration-200 bg-slate-50/30 font-semibold text-slate-800 ${errors.firstName ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'}`}
            />
          </div>
          {errors.firstName && <p className="text-[10px] font-bold text-red-500 animate-in fade-in duration-150">{errors.firstName}</p>}
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nom de famille</label>
          <input 
            type="text" placeholder="Ex: Diop" value={student.lastName} 
            onChange={e => setStudent({...student, lastName: e.target.value})} 
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all duration-200 bg-slate-50/30 font-semibold text-slate-800 ${errors.lastName ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'}`}
          />
          {errors.lastName && <p className="text-[10px] font-bold text-red-500 animate-in fade-in duration-150">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Genre / Sexe</label>
          <select 
            value={student.sex} 
            onChange={e => setStudent({...student, sex: e.target.value as 'M' | 'F'})} 
            className="w-full px-3 py-2.5 bg-slate-50/30 rounded-xl border border-slate-200 text-xs outline-none focus:border-sky-500 transition-all duration-200 font-semibold text-slate-800"
          >
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date de naissance</label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input 
              type="date" value={student.birthDate} 
              onChange={e => setStudent({...student, birthDate: e.target.value})} 
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs outline-none transition-all duration-200 bg-slate-50/30 font-semibold text-slate-800 ${errors.birthDate ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'}`}
            />
          </div>
          {errors.birthDate && <p className="text-[10px] font-bold text-red-500 animate-in fade-in duration-150">{errors.birthDate}</p>}
        </div>
      </div>

      <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Classe / Niveau</label>
          <span className="font-bold text-slate-800 text-xs">
            {levels.find(l => l.id === student.levelId)?.name || 'Non sélectionné'}
          </span>
        </div>
        <span className="text-[9px] bg-sky-50 text-sky-600 font-bold px-2 py-0.5 rounded-lg border border-sky-100">
          Pré-sélectionné
        </span>
      </div>
    </div>
  );
};
