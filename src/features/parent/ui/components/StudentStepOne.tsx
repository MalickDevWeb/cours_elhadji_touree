import React, { useState } from 'react';
import { Level } from '../../../../types';
import { defaultSchoolCycles } from '../../../shared/infrastructure/mockDbData';

interface StudentStepOneProps {
  firstName: string; lastName: string; sex: 'M' | 'F'; birthDate: string; levelId: string;
  levels: Level[]; onChange: (field: string, val: any) => void;
}

export function StudentStepOne({
  firstName, lastName, sex, birthDate, levelId, levels, onChange
}: StudentStepOneProps) {
  const cycles = defaultSchoolCycles;
  const [cycleId, setCycleId] = useState<string>(() => {
    if (levelId) {
      const match = cycles.find(c => c.levels.some(cl => levels.find(l => l.id === levelId)?.name.toLowerCase() === cl.toLowerCase()));
      if (match) return match.id;
    }
    return 'ALL';
  });

  const activeCycle = cycles.find(c => c.id === cycleId);
  const displayLevels = cycleId === 'ALL'
    ? levels
    : levels.filter(l => activeCycle?.levels.some(cl => cl.toLowerCase() === l.name.toLowerCase()));

  const handleCycleChange = (cId: string) => {
    setCycleId(cId);
    onChange('levelId', '');
  };

  return (
    <div className="space-y-3 text-left animate-in fade-in duration-150 text-xs">
      <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest block">Étape 1 sur 2 : Profil Élève</span>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-slate-500 block mb-1">Prénom</label>
          <input type="text" placeholder="Ex: Omar" value={firstName} onChange={e => onChange('firstName', e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none text-slate-700 font-medium" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 block mb-1">Nom de famille</label>
          <input type="text" placeholder="Ex: Diallo" value={lastName} onChange={e => onChange('lastName', e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none text-slate-700 font-medium" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 block mb-1">Genre</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => onChange('sex', 'M')} className={`p-2 rounded-xl border font-bold transition flex justify-center items-center ${sex === 'M' ? 'bg-sky-50 border-sky-300 text-sky-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Garçon</button>
          <button type="button" onClick={() => onChange('sex', 'F')} className={`p-2 rounded-xl border font-bold transition flex justify-center items-center ${sex === 'F' ? 'bg-pink-50 border-pink-300 text-pink-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Fille</button>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 block mb-1">Date de naissance</label>
        <input type="date" value={birthDate} onChange={e => onChange('birthDate', e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none text-slate-700 font-medium" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 block">Cycle Scolaire</label>
        <div className="flex gap-1 flex-wrap mb-1.5">
          <button type="button" onClick={() => handleCycleChange('ALL')} className={`px-2 py-0.5 rounded-lg text-[9px] font-bold cursor-pointer transition ${cycleId === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Tous les cycles</button>
          {cycles.map(c => (
            <button key={c.id} type="button" onClick={() => handleCycleChange(c.id)} className={`px-2 py-0.5 rounded-lg text-[9px] font-bold cursor-pointer transition ${cycleId === c.id ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>
          ))}
        </div>
        <label className="text-[10px] font-bold text-slate-500 block">Classe / Niveau ({displayLevels.length} classe{displayLevels.length > 1 ? 's' : ''})</label>
        <select value={levelId} onChange={e => onChange('levelId', e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none bg-white text-slate-700 font-medium text-xs cursor-pointer" required>
          <option value="">-- Sélectionner le niveau --</option>
          {displayLevels.map(lvl => <option key={lvl.id} value={lvl.id}>{lvl.name}</option>)}
        </select>
      </div>
    </div>
  );
}
