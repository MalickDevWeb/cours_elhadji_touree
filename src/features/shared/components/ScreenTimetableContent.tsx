import React from 'react';
import { Calendar, Clock, MapPin, User, GraduationCap, ShieldCheck, School } from 'lucide-react';
import { Student, Level, Settings } from '../../../types';
import { TimetableItem } from './TimetableTable';

interface ScreenTimetableContentProps {
  student: Student; level?: Level; items: TimetableItem[]; settings?: Settings;
}

export const ScreenTimetableContent: React.FC<ScreenTimetableContentProps> = ({ student, level, items, settings }) => {
  const schoolName = settings?.centerName || "Groupe Scolaire Élite Dakar";
  const schoolYear = settings?.schoolYear || "2025-2026";

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4 text-slate-800 w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg border border-slate-200" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-sky-900 text-amber-400 flex items-center justify-center font-black shrink-0"><School className="w-5 h-5" /></div>
          )}
          <div>
            <h2 className="font-display font-black text-sm sm:text-base text-sky-950 uppercase tracking-tight">{schoolName}</h2>
            <p className="text-[10px] text-sky-600 font-extrabold uppercase tracking-widest mt-0.5">Emploi du Temps Officiel • {schoolYear}</p>
          </div>
        </div>
        <div className="self-start sm:self-auto bg-sky-900 text-amber-400 font-black text-[9px] sm:text-[10px] px-3 py-1 rounded-full uppercase">Réf : EDT-{student.id.toUpperCase()}</div>
      </div>

      <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black shrink-0"><GraduationCap className="w-5 h-5" /></div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white">{student.firstName} {student.lastName}</h3>
            <p className="text-[10px] text-slate-300">Niveau : <span className="text-amber-400 font-bold">{level?.name || 'N/A'}</span></p>
          </div>
        </div>
        <div className="text-left sm:text-right text-[10px] text-slate-300 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0 w-full sm:w-auto flex sm:block justify-between">
          <span>Genre : <strong className="text-white">{student.sex === 'M' ? 'Masculin' : 'Féminin'}</strong></span>
          <span className="sm:ml-3">Statut : <strong className="text-emerald-400">Élève Actif</strong></span>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="font-display font-black text-xs text-slate-900 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
          <Calendar className="w-4 h-4 text-sky-600" /> Planning des Cours
        </h4>

        {items.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium text-xs">Aucun cours planifié.</div>
        ) : (
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id} className="bg-slate-50 hover:bg-sky-50/50 p-3 rounded-2xl border border-slate-200/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-700 text-[10.5px] bg-sky-100/80 px-2 py-0.5 rounded-md flex items-center gap-1"><Clock className="w-3 h-3 text-sky-600 shrink-0" /> {it.schedule}</span>
                    <span className={`px-2 py-0.5 rounded-md font-extrabold text-[8px] uppercase ${it.type === 'GROUPE' ? 'bg-sky-200/60 text-sky-900' : 'bg-emerald-200/60 text-emerald-900'}`}>{it.type}</span>
                  </div>
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{it.subject}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {it.teacher}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {it.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9.5px] text-slate-400 font-medium">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Document Officiel Certifié</span>
        <span>{schoolName} • {schoolYear}</span>
      </div>
    </div>
  );
};

