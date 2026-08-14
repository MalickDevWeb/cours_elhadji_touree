import React from 'react';
import { MapPin, Eye, FileText } from 'lucide-react';
import { Group, Assignment, Subject, Teacher } from '../../../../types';

interface StudentTimetableProps {
  groups: Group[];
  assignments: Assignment[];
  subjects: Subject[];
  teachers: Teacher[];
  studentId: string;
  onOpenModal?: () => void;
}

export function StudentTimetable({ groups, assignments, subjects, teachers, studentId, onOpenModal }: StudentTimetableProps) {
  const timetable = groups.filter(g => g.studentIds.includes(studentId));
  const indivTimetable = assignments.filter(a => a.type === 'INDIVIDUEL' && a.studentId === studentId);

  return (
    <div className="space-y-2.5">
      {onOpenModal && (
        <button
          onClick={onOpenModal}
          className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs mb-1"
        >
          <Eye className="w-3.5 h-3.5 text-sky-600" /> Visionner / Télécharger Emploi du Temps PDF
        </button>
      )}

      {timetable.map(group => {
        const sub = subjects.find(s => s.id === group.subjectId);
        const teach = teachers.find(t => t.id === group.teacherId);
        return (
          <div key={group.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-left">
            <div>
              <span className="font-bold text-slate-800 text-[11px]">{sub?.name}</span>
              <p className="text-slate-400 text-[9px]">Professeur : <span className="font-bold text-slate-500">{teach?.fullName}</span></p>
              <p className="text-slate-400 text-[9px] flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {group.room}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="bg-sky-50 text-sky-600 border border-sky-100 px-1.5 py-0.5 rounded font-extrabold text-[7.5px] uppercase tracking-wider">Groupe</span>
              <p className="text-slate-700 font-bold font-mono text-[10px] mt-1">{group.schedule}</p>
            </div>
          </div>
        );
      })}
      {indivTimetable.map(asg => {
        const sub = subjects.find(s => s.id === asg.subjectId);
        const teach = teachers.find(t => t.id === asg.teacherId);
        return (
          <div key={asg.id} className="p-3 bg-emerald-50/10 rounded-2xl border border-emerald-100 flex justify-between items-center text-left">
            <div>
              <span className="font-bold text-slate-800 text-[11px]">{sub?.name}</span>
              <p className="text-slate-400 text-[9px]">Professeur : <span className="font-bold text-slate-500">{teach?.fullName}</span></p>
              <p className="text-slate-400 text-[9px] flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {asg.location}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-extrabold text-[7.5px] uppercase tracking-wider">Individuel</span>
              <p className="text-slate-700 font-bold font-mono text-[10px] mt-1">{asg.schedule}</p>
            </div>
          </div>
        );
      })}
      {timetable.length === 0 && indivTimetable.length === 0 && (
        <p className="text-slate-400 italic text-[10px] py-4 text-center">Aucun cours planifié pour cet élève.</p>
      )}
    </div>
  );
}

