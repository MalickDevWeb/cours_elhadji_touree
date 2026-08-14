import React, { useState } from 'react';
import { Users, UserCheck, Heart } from 'lucide-react';
import { Student, Parent, Teacher, Level, Subject } from '../../../types';
import { AdminStudents } from './AdminStudents';
import { AdminParents } from './AdminParents';
import { AdminTeachers } from './AdminTeachers';

interface AdminUsersSectionProps {
  students: Student[];
  parents: Parent[];
  teachers: Teacher[];
  levels: Level[];
  subjects: Subject[];
  onAddStudent: (std: Omit<Student, 'id'>, p: Omit<Parent, 'id'>) => void;
  onAddTeacher: (t: Omit<Teacher, 'id'>) => void;
  onUpdateStudents: (list: Student[]) => void;
  onUpdateParents: (list: Parent[]) => void;
  onUpdateTeachers: (list: Teacher[]) => void;
  onViewPdf: (studentId: string) => void;
}

type UserSubTab = 'ELEVES' | 'PARENTS' | 'PROFS';

export function AdminUsersSection({
  students,
  parents,
  teachers,
  levels,
  subjects,
  onAddStudent,
  onAddTeacher,
  onUpdateStudents,
  onUpdateParents,
  onUpdateTeachers,
  onViewPdf,
}: AdminUsersSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<UserSubTab>('ELEVES');

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm border border-slate-200/60">
        {[
          { id: 'ELEVES', label: 'Élèves', icon: Users, color: 'text-sky-500' },
          { id: 'PARENTS', label: 'Parents', icon: Heart, color: 'text-rose-500' },
          { id: 'PROFS', label: 'Professeurs', icon: UserCheck, color: 'text-emerald-500' },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              id={`user-sub-tab-${sub.id}`}
              onClick={() => setActiveSubTab(sub.id as UserSubTab)}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                isActive ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${sub.color}`} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      {activeSubTab === 'ELEVES' && (
        <AdminStudents
          students={students}
          parents={parents}
          levels={levels}
          onAddStudent={onAddStudent}
          onViewPdf={onViewPdf}
          onUpdateStudents={onUpdateStudents}
        />
      )}

      {activeSubTab === 'PARENTS' && (
        <AdminParents
          parents={parents}
          students={students}
          onUpdateParents={onUpdateParents}
          onUpdateStudents={onUpdateStudents}
        />
      )}

      {activeSubTab === 'PROFS' && (
        <AdminTeachers
          teachers={teachers}
          subjects={subjects}
          levels={levels}
          onAddTeacher={onAddTeacher}
          onUpdateTeachers={onUpdateTeachers}
        />
      )}
    </div>
  );
}
