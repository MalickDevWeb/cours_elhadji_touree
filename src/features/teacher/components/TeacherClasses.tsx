import { useState } from 'react';
import { BookOpen, Users, Calendar } from 'lucide-react';
import { Group, Student, Subject } from '../../../types';
import { TeacherClassDetails } from './TeacherClassDetails';

interface TeacherClassesProps {
  myGroups: Group[];
  myStudents: Student[];
  subjects: Subject[];
  attendanceHistory: any;
  observationsHistory: any;
}

export function TeacherClasses({
  myGroups,
  myStudents,
  subjects,
  attendanceHistory,
  observationsHistory,
}: TeacherClassesProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Matière';

  const activeGroup = myGroups.find(g => g.id === selectedGroupId);
  const activeStudents = activeGroup
    ? myStudents.filter(s => activeGroup.studentIds.includes(s.id))
    : [];

  if (activeGroup) {
    return (
      <TeacherClassDetails
        grp={activeGroup}
        students={activeStudents}
        subject={getSubjectName(activeGroup.subjectId)}
        attendanceHistory={attendanceHistory}
        observationsHistory={observationsHistory}
        onBack={() => setSelectedGroupId(null)}
      />
    );
  }

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      <div>
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" /> Mes Classes & Groupes
        </h3>
        <p className="text-slate-400">Consultez l'historique et les effectifs des groupes sous votre responsabilité.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {myGroups.map(grp => (
          <div
            key={grp.id}
            onClick={() => setSelectedGroupId(grp.id)}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs hover:border-amber-300 hover:shadow-xs cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                  {getSubjectName(grp.subjectId)}
                </span>
                <h4 className="font-display font-bold text-slate-800 text-xs mt-1.5 group-hover:text-amber-600 transition">
                  🏫 {grp.name}
                </h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
              <span className="flex items-center gap-1">📍 Salle : {grp.room}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {grp.schedule}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
