import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { Assignment, Subject, Group, Student } from '../../../types';

interface TeacherScheduleProps {
  myAssignments: Assignment[];
  subjects: Subject[];
  groups: Group[];
  students: Student[];
  onSelectCourse: (id: string) => void;
}

export function TeacherSchedule({
  myAssignments,
  subjects,
  groups,
  students,
  onSelectCourse,
}: TeacherScheduleProps) {
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Matière';
  const getGroupName = (id?: string) => groups.find(g => g.id === id)?.name || 'Classe';
  const getStudentName = (id?: string) => {
    const s = students.find(std => std.id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Élève';
  };

  const getStudentCount = (course: Assignment) => {
    if (course.type === 'INDIVIDUEL') return 1;
    const g = groups.find(grp => grp.id === course.groupId);
    return g ? g.studentIds.length : 0;
  };

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" /> Emploi du temps
          </h3>
          <p className="text-slate-400">Retrouvez la liste et les détails de vos créneaux horaires programmés.</p>
        </div>
      </div>

      {myAssignments.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-3xs text-center text-slate-400">
          Aucun cours dans votre calendrier pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {myAssignments.map((asg) => (
            <div
              key={asg.id}
              onClick={() => onSelectCourse(asg.id)}
              className="bg-white p-4 rounded-2xl border border-slate-250 shadow-3xs flex items-center justify-between hover:border-amber-300 transition-all cursor-pointer group active:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                {/* Visual day badge */}
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Jour</span>
                  <span className="font-bold text-slate-700 text-[10px]">
                    {asg.schedule.split(' ')[0]}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      📚 {getSubjectName(asg.subjectId)}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                      {asg.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {asg.schedule.split(' ').slice(1).join(' ')}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      🎯 {asg.type === 'INDIVIDUEL' ? getStudentName(asg.studentId) : getGroupName(asg.groupId)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {asg.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {getStudentCount(asg)} élève{getStudentCount(asg) > 1 ? 's' : ''}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
