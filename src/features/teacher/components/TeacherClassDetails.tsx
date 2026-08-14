import { useMemo } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Group, Student } from '../../../types';

interface TeacherClassDetailsProps {
  grp: Group;
  students: Student[];
  subject: string;
  attendanceHistory: any;
  observationsHistory: any;
  onBack: () => void;
}

export function TeacherClassDetails({
  grp,
  students,
  subject,
  attendanceHistory,
  observationsHistory,
  onBack,
}: TeacherClassDetailsProps) {
  const stats = useMemo(() => {
    let totalPresent = 0;
    let totalRecords = 0;
    let totalObs = 0;

    students.forEach(s => {
      const atts = attendanceHistory[s.id] || [];
      const obs = observationsHistory[s.id] || [];
      totalObs += obs.length;
      atts.forEach((a: any) => {
        if (a.subjectName === subject) {
          totalRecords++;
          if (a.status === 'PRESENT' || a.status === 'RETARD') totalPresent++;
        }
      });
    });

    const attRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 100;
    return { attRate, totalObs };
  }, [students, attendanceHistory, subject, observationsHistory]);

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-amber-600 font-bold hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Retour aux classes
      </button>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-3xs space-y-3">
        <h3 className="font-display font-bold text-slate-800 text-sm">🏫 {grp.name}</h3>
        <p className="text-slate-400">Suivi complet et statistiques pour cette classe.</p>

        <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-bold text-slate-700 text-center">
          <div>
            <span className="text-[8px] text-slate-400 block uppercase">Matière</span>
            <span className="text-amber-600 truncate block">{subject}</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block uppercase">Élèves</span>
            <span>{students.length}</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block uppercase">Présence</span>
            <span className="text-emerald-600">{stats.attRate}%</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block uppercase">Remarques</span>
            <span className="text-violet-600">{stats.totalObs}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-display font-bold text-slate-700">Membres de la classe</h4>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {students.map(s => {
            const atts = attendanceHistory[s.id] || [];
            const obs = observationsHistory[s.id] || [];
            const lastAtt = atts.find((a: any) => a.subjectName === subject);
            return (
              <div key={s.id} className="p-3 flex justify-between items-center text-[11px]">
                <div>
                  <span className="font-bold text-slate-800">👤 {s.firstName} {s.lastName}</span>
                  <p className="text-slate-400 text-[9px] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Dernier cours : {lastAtt ? `${lastAtt.date} (${lastAtt.status})` : 'Néant'}
                  </p>
                </div>
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                  {obs.length} obs.
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
