import { BookOpen, MessageSquare } from 'lucide-react';
import { GradeRecord, ObservationRecord } from '../../domain/parentMockData';

interface StudentGradesProps {
  grades: GradeRecord[];
  observations: ObservationRecord[];
}

export function StudentGrades({ grades, observations }: StudentGradesProps) {
  return (
    <div className="space-y-6 text-left select-none text-xs">
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" /> Évaluations & Notes
        </h3>

        {grades.length === 0 ? (
          <p className="text-slate-400 italic text-[10px] py-4 text-center">Aucune note saisie pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {grades.map((g, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 text-[11px]">{g.subjectName}</span>
                  <div className="flex flex-wrap gap-1">
                    {g.grades.map((grd, gIdx) => (
                      <span key={gIdx} className="bg-white border border-slate-200 text-slate-700 font-bold font-mono px-1.5 py-0.5 rounded text-[10px]">
                        {grd}/20
                      </span>
                    ))}
                  </div>
                  <p className="text-[9.5px] text-slate-500 italic">"{g.comment}"</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[8px] text-slate-400 block font-bold uppercase">Moyenne</span>
                  <span className="text-xs font-black text-sky-600 font-mono">{g.average.toFixed(1)}/20</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-500" /> Observations des enseignants
        </h3>

        {observations.length === 0 ? (
          <p className="text-slate-400 italic text-[10px] py-4 text-center">Aucune observation enregistrée.</p>
        ) : (
          <div className="space-y-3">
            {observations.map((o, idx) => (
              <div key={idx} className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-[9px] text-slate-400">
                  <span className="font-bold text-slate-500">{o.teacherName} ({o.subjectName})</span>
                  <span className="font-mono">{o.date}</span>
                </div>
                <p className="text-slate-600 text-[10.5px] leading-relaxed italic">
                  "{o.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
