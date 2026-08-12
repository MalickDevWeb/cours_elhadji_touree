import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Student, Level, Group, Assignment, Subject, Teacher, Settings } from '../../../types';
import { TimetableHeader } from './TimetableHeader';
import { TimetableTable, TimetableItem } from './TimetableTable';

interface TimetablePdfViewProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  student: Student;
  level?: Level;
  groups: Group[];
  assignments: Assignment[];
  subjects: Subject[];
  teachers: Teacher[];
  settings?: Settings;
}

export const TimetablePdfView: React.FC<TimetablePdfViewProps> = ({
  printRef, student, level, groups, assignments, subjects, teachers, settings
}) => {
  const studentGroups = groups.filter(g => g.studentIds.includes(student.id));
  const studentAssignments = assignments.filter(a => a.type === 'INDIVIDUEL' && a.studentId === student.id);

  const items: TimetableItem[] = [
    ...studentGroups.map(g => ({
      id: g.id,
      subject: subjects.find(s => s.id === g.subjectId)?.name || 'Matière',
      teacher: teachers.find(t => t.id === g.teacherId)?.fullName || 'Non assigné',
      location: g.room || 'Salle de cours',
      schedule: g.schedule,
      type: 'GROUPE'
    })),
    ...studentAssignments.map(a => ({
      id: a.id,
      subject: subjects.find(s => s.id === a.subjectId)?.name || 'Matière',
      teacher: teachers.find(t => t.id === a.teacherId)?.fullName || 'Non assigné',
      location: a.location || 'Sur mesure',
      schedule: a.schedule,
      type: 'INDIVIDUEL'
    }))
  ];

  const centerName = settings?.centerName || "Groupe Scolaire Élite Dakar";

  return (
    <div className="bg-slate-200/50 p-4 flex justify-center">
      <div
        ref={printRef}
        className="bg-white w-[210mm] min-h-[297mm] p-8 shadow-xl border border-slate-200 text-slate-800 space-y-6 flex flex-col justify-between font-sans"
      >
        <div className="space-y-4">
          <TimetableHeader student={student} level={level} settings={settings} />
          <TimetableTable items={items} />
        </div>

        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-6 text-[9.5px] text-slate-500">
          <div className="space-y-1">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Emploi du Temps Certifié
            </p>
            <p>Délivré exclusivement par {centerName} pour l'élève {student.firstName} {student.lastName}.</p>
            <p className="text-slate-400 font-mono">Date d'impression : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="text-right flex flex-col justify-between items-end">
            <p className="font-bold text-slate-700 uppercase">La Direction Pédagogique</p>
            <div className="w-28 h-10 border-b border-dashed border-slate-300 mt-2 flex items-center justify-center text-[8px] text-slate-300 italic">
              Cachet & Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
