import React, { useState, useEffect } from 'react';
import { Subject, Settings, Level, CourseOffer } from '../../../types';
import { ChevronRight } from 'lucide-react';
import { calculatePreinscriptionPrice } from '../../shared/utils/pricing';
import { defaultSchoolCycles } from '../../shared/infrastructure/mockDbData';

interface CourseStepProps {
  levels: Level[]; subjects: Subject[]; settings: Settings; courseOffers: CourseOffer[];
  course: { type: 'INDIVIDUEL' | 'GROUPE'; subjectIds: string[] };
  setCourse: React.Dispatch<React.SetStateAction<{ type: 'INDIVIDUEL' | 'GROUPE'; subjectIds: string[] }>>;
  student: { levelId: string }; setStudent: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void; initialCycleId?: string;
}

export const EnrollmentCourseStep: React.FC<CourseStepProps> = ({
  levels, subjects, settings, courseOffers, course, setCourse, student, setStudent, onNext, initialCycleId
}) => {
  const cycles = settings?.cycles || defaultSchoolCycles;
  const [cycleId, setCycleId] = useState<string>(() => {
    if (initialCycleId) return initialCycleId;
    if (student.levelId) {
      const match = cycles.find(c => c.levels.some(cl => levels.find(l => l.id === student.levelId)?.name.toLowerCase() === cl.toLowerCase()));
      if (match) return match.id;
    }
    return 'ALL';
  });

  const activeCycle = cycles.find(c => c.id === cycleId);
  const displayLevels = cycleId === 'ALL' ? levels : levels.filter(l => activeCycle?.levels.some(cl => cl.toLowerCase() === l.name.toLowerCase()));

  const handleCycleChange = (cId: string) => {
    setCycleId(cId);
    setStudent((p: any) => ({ ...p, levelId: '' }));
  };

  const handleLevelSelect = (val: string) => {
    setStudent((p: any) => ({ ...p, levelId: val }));
    if (val) {
      const match = cycles.find(c => c.levels.some(cl => levels.find(l => l.id === val)?.name.toLowerCase() === cl.toLowerCase()));
      if (match) setCycleId(match.id);
    }
  };

  const isPrimary = !!(student.levelId && student.levelId <= 'lvl-06');
  useEffect(() => {
    if (isPrimary) setCourse(p => (p.subjectIds[0] === 'sub-general' ? p : { ...p, subjectIds: ['sub-general'] }));
    else setCourse(p => (p.subjectIds.includes('sub-general') ? { ...p, subjectIds: [] } : p));
  }, [isPrimary, setCourse]);

  const priceVal = calculatePreinscriptionPrice(student.levelId, course.type, course.subjectIds, courseOffers);
  const priceText = course.type === 'INDIVIDUEL' ? 'À discuter' : (student.levelId ? `${priceVal.toLocaleString('fr-FR')} FCFA / mois` : 'Choisir niveau');

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200 text-xs font-sans">
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">1. Filtrer par Cycle Scolaire</label>
        <div className="flex gap-1.5 flex-wrap">
          <button type="button" onClick={() => handleCycleChange('ALL')} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${cycleId === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Tous les cycles</button>
          {cycles.map(c => (
            <button key={c.id} type="button" onClick={() => handleCycleChange(c.id)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${cycleId === c.id ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Classe / Niveau Scolaire ({displayLevels.length} classe{displayLevels.length > 1 ? 's' : ''})</label>
        <select value={student.levelId} onChange={e => handleLevelSelect(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500 font-semibold cursor-pointer text-slate-800" required>
          <option value="">-- Choisir la classe --</option>
          {cycleId !== 'ALL' ? displayLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>) : (
            cycles.map(cyc => (
              <optgroup key={cyc.id} label={cyc.name}>
                {levels.filter(l => cyc.levels.some(cl => cl.toLowerCase() === l.name.toLowerCase())).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </optgroup>
            ))
          )}
        </select>
      </div>
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">2. Matières souhaitées</label>
        {isPrimary ? (
          <div className="p-2.5 bg-sky-50/40 border border-sky-100 rounded-2xl flex items-center justify-between">
            <div><span className="font-bold text-slate-800 text-xs">Enseignement Général</span><p className="text-[9px] text-slate-400 font-semibold">Toutes les matières du Primaire incluses</p></div>
            <span className="text-[8px] bg-sky-100 text-sky-700 font-black px-2 py-0.5 rounded">Inclus</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto pr-1">
            {subjects.filter(s => s.active).map(sub => (
              <button key={sub.id} type="button" onClick={() => setCourse(c => ({ ...c, subjectIds: c.subjectIds.includes(sub.id) ? c.subjectIds.filter(x => x !== sub.id) : [...c.subjectIds, sub.id] }))} className={`p-1.5 rounded-xl border text-left font-bold transition text-[10px] cursor-pointer flex items-center justify-between ${course.subjectIds.includes(sub.id) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <span>{sub.name}</span>{course.subjectIds.includes(sub.id) && <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div><span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Tarif mensuel estimé</span><span className="font-black text-sky-400 text-xs sm:text-sm">{priceText}</span></div>
          <span className="text-[9px] bg-white/10 text-slate-300 font-bold px-2 py-0.5 rounded">{course.type === 'GROUPE' ? 'En Classe' : 'À Domicile'}</span>
        </div>
        <button type="button" onClick={onNext} disabled={!student.levelId} className="bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1 text-xs cursor-pointer transition shrink-0 shadow-xs">Suivant <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
