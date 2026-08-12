import { Clock, MapPin, ArrowRight, QrCode } from 'lucide-react';
import { Teacher, Assignment, Group, Student, Subject } from '../../../types';

interface TeacherHomeProps {
  me: Teacher; stats?: { coursesCount: number; classesCount: number; studentsCount: number };
  nextCourse: Assignment | null; subjects: Subject[]; groups: Group[]; students: Student[];
  onSelectCourse: (id: string) => void;
  onOpenScannerModal?: () => void;
}

export function TeacherHome({ me, nextCourse, subjects, groups, students, onSelectCourse, onOpenScannerModal }: TeacherHomeProps) {
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Matière';
  const getGroupName = (id?: string) => groups.find(g => g.id === id)?.name || 'Classe';
  const getStudentName = (id?: string) => { const s = students.find(std => std.id === id); return s ? `${s.firstName} ${s.lastName}` : 'Élève'; };
  const getStudentCount = (c: Assignment) => c.type === 'INDIVIDUEL' ? 1 : (groups.find(g => g.id === c.groupId)?.studentIds.length || 0);

  return (
    <div className="space-y-6 text-xs animate-fade-in">
      <div className="bg-radial from-amber-600 to-amber-700 text-white p-6 rounded-3xl space-y-3 shadow-lg border border-amber-500/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200">Tableau de bord</span>
          <h1 className="font-display font-bold text-lg md:text-xl">Bonjour, {me.fullName} 👋</h1>
          <p className="text-amber-100 leading-relaxed max-w-xl text-[11px]">Suivez les présences de vos élèves et envoyez vos remarques en temps réel.</p>
        </div>
        {onOpenScannerModal && (
          <button
            onClick={onOpenScannerModal}
            className="bg-slate-950 hover:bg-slate-900 text-amber-300 border border-amber-400/40 font-bold py-2.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md shrink-0 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" /> Scanner Carte Élève
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Prochain cours programmé</h3>
        {nextCourse ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 space-y-4 hover:border-amber-300 transition relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase">{nextCourse.type}</span>
                <h4 className="font-display font-bold text-slate-800 text-sm mt-1">📚 {getSubjectName(nextCourse.subjectId)}</h4>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Horaire</span>
                <span className="font-bold text-slate-700 flex items-center justify-end gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {nextCourse.schedule}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-1 text-[11px] font-medium text-slate-500">
              <div><span className="text-[9px] text-slate-400 block uppercase font-semibold">Bénéficiaire</span><span className="text-slate-700 font-bold">{nextCourse.type === 'INDIVIDUEL' ? getStudentName(nextCourse.studentId) : getGroupName(nextCourse.groupId)}</span></div>
              <div><span className="text-[9px] text-slate-400 block uppercase font-semibold">Lieu</span><span className="text-slate-700 font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {nextCourse.location}</span></div>
              <div><span className="text-[9px] text-slate-400 block uppercase font-semibold">Élèves</span><span className="text-slate-700 font-bold">{getStudentCount(nextCourse)} élève(s)</span></div>
            </div>

            <button onClick={() => onSelectCourse(nextCourse.id)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer">
              Entrer dans le cours <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400">Aucun cours programmé aujourd'hui.</div>
        )}
      </div>
    </div>
  );
}
