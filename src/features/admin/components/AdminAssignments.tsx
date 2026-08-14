import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Assignment, Student, Teacher, Subject, Group, Level } from '../../../types';
import { AddGroupForm } from './AddGroupForm';
import { AddAssignmentForm } from './AddAssignmentForm';
import { AssignmentDetailModal } from './AssignmentDetailModal';

interface AssignmentsProps {
  assignments: Assignment[];
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  groups: Group[];
  levels: Level[];
  onAddAssignment: (asg: Omit<Assignment, 'id'>) => void;
  onAddGroup: (g: Omit<Group, 'id' | 'studentIds'>) => void;
  onUpdateAssignment: (asgs: Assignment[]) => void;
  onUpdateGroup: (grps: Group[]) => void;
}

export const AdminAssignments: React.FC<AssignmentsProps> = ({
  assignments, students, teachers, subjects, groups, levels, onAddAssignment, onAddGroup, onUpdateAssignment, onUpdateGroup
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
        <h3 className="font-display font-extrabold text-slate-800 text-sm">Gestion Pédagogique (Cours & Groupes)</h3>
        <div className="flex gap-2.5 w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap">
          <button id="show-add-grp-btn" onClick={() => { setShowGroup(!showGroup); setShowAdd(false); }} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl transition flex-1 lg:flex-none text-center cursor-pointer whitespace-nowrap text-xs shadow-xs">Créer un Groupe</button>
          <button id="show-add-asg-btn" onClick={() => { setShowAdd(!showAdd); setShowGroup(false); }} className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2.5 rounded-xl transition flex-1 lg:flex-none text-center cursor-pointer whitespace-nowrap text-xs shadow-xs">Planifier un cours</button>
        </div>
      </div>

      {showGroup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center z-50 p-4 overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200">
          <AddGroupForm levels={levels} subjects={subjects} teachers={teachers} assignments={assignments} groups={groups} onAddGroup={onAddGroup} onClose={() => setShowGroup(false)} />
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center z-50 p-4 overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200">
          <AddAssignmentForm students={students} teachers={teachers} subjects={subjects} groups={groups} assignments={assignments} onAddAssignment={onAddAssignment} onClose={() => setShowAdd(false)} />
        </div>
      )}

      {selectedAsg && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center z-50 p-4 overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200">
          <AssignmentDetailModal assignment={selectedAsg} group={selectedAsg.groupId ? groups.find(g => g.id === selectedAsg.groupId) : undefined} students={students} teachers={teachers} subjects={subjects} levels={levels} assignments={assignments} groups={groups} onUpdateAssignment={onUpdateAssignment} onUpdateGroup={onUpdateGroup} onClose={() => setSelectedAsg(null)} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map(asg => {
          const teacher = teachers.find(t => t.id === asg.teacherId);
          const subject = subjects.find(s => s.id === asg.subjectId);
          const student = asg.studentId ? students.find(s => s.id === asg.studentId) : null;
          const group = asg.groupId ? groups.find(g => g.id === asg.groupId) : null;
          return (
            <div key={asg.id} onClick={() => setSelectedAsg(asg)} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-xs transition duration-200 cursor-pointer space-y-3 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-1">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${asg.type === 'INDIVIDUEL' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-sky-50 text-sky-600 border border-sky-200'}`}>{asg.type}</span>
                <span className="text-[9px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1 shrink-0"><Calendar className="w-3 h-3 text-slate-400" /> {asg.schedule}</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-800 text-xs mb-0.5">{asg.type === 'INDIVIDUEL' ? `Cours : ${student?.firstName} ${student?.lastName}` : `Groupe : ${group?.name}`}</h4>
                <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-300" /> {asg.location}</p>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <span className="truncate">Prof : {teacher?.fullName}</span>
                <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium shrink-0">{subject?.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
