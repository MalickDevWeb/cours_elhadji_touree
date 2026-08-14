import React from 'react';
import { Award, CheckCircle2, BookOpen, School, GraduationCap, Calculator, BookText, FlaskConical, Dna, Globe, Brain, Sparkles } from 'lucide-react';
import { Subject, Settings } from '../../../types';
import { defaultSchoolCycles } from '../../shared/infrastructure/mockDbData';

interface NiveauxTabProps {
  subjects: Subject[];
  settings?: Settings;
}

const getCycleTheme = (name: string, code?: string) => {
  const lower = (name + ' ' + (code || '')).toLowerCase();
  if (lower.includes('prim')) return { icon: BookOpen, bg: 'bg-sky-50 text-sky-600 border-sky-100' };
  if (lower.includes('cem') || lower.includes('coll')) return { icon: School, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
  return { icon: GraduationCap, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
};

const getSubjectIcon = (sName: string) => {
  const l = sName.toLowerCase();
  if (l.includes('math')) return Calculator;
  if (l.includes('fran')) return BookText;
  if (l.includes('physi') || l.includes('chim')) return FlaskConical;
  if (l.includes('svt') || l.includes('bio')) return Dna;
  if (l.includes('angla')) return Globe;
  if (l.includes('philo')) return Brain;
  return BookOpen;
};

export const ProgramsNiveauxTab: React.FC<NiveauxTabProps> = ({ subjects, settings }) => {
  const cycles = settings?.cycles || defaultSchoolCycles;

  return (
    <div className="grid lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
      <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100"><Award className="w-5 h-5" /></div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-black text-slate-900 tracking-tight">Structure des Cycles & Tarifs</h3>
            <p className="text-[11px] text-slate-500">Cycles scolaires, niveaux et frais d'inscription/mensualités</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {cycles.map((cyc) => {
            const theme = getCycleTheme(cyc.name, cyc.code);
            const Icon = theme.icon;
            return (
              <div key={cyc.id} className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3 transition duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${theme.bg}`}><Icon className="w-4 h-4" /></div>
                    <span className="font-extrabold text-slate-900 text-sm">{cyc.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="bg-amber-500/10 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold px-2.5 py-1 rounded-xl">Inscription : <strong className="font-black text-amber-900">{cyc.registrationFee.toLocaleString('fr-FR')} F</strong></span>
                    <span className="bg-emerald-500/10 text-emerald-800 border border-emerald-200/80 text-[10.5px] font-bold px-2.5 py-1 rounded-xl"><strong className="font-black text-emerald-900">{cyc.monthlyFee.toLocaleString('fr-FR')} F</strong>/mois</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] shrink-0">Niveaux :</span>
                  <div className="flex flex-wrap gap-1">
                    {cyc.levels.map((lvl) => (
                      <span key={lvl} className="bg-white text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs font-semibold text-[10.5px]">{lvl}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-black text-slate-900 tracking-tight">Matières Clés Dispensées</h3>
              <p className="text-[11px] text-slate-500">Enseignement sur mesure par discipline</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {subjects.filter(s => s.active).map(sub => {
              const SubIcon = getSubjectIcon(sub.name);
              return (
                <div key={sub.id} className="flex items-center gap-2 px-3 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition">
                  <SubIcon className="w-4 h-4 text-sky-600 shrink-0" /><span className="truncate">{sub.name}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 text-slate-800 rounded-2xl p-4 border border-sky-100/80 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 text-sky-700 font-bold uppercase tracking-wider text-[9.5px]">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Approche Pédagogique
          </div>
          <p className="text-slate-600 leading-relaxed">
            Chaque cours intègre des fiches de résumé, des exercices progressifs et des examens blancs réguliers.
          </p>
        </div>
      </div>
    </div>
  );
};
