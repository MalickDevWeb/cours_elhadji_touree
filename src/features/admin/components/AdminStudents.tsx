import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Student, Parent, Level } from '../../../types';
import { AddStudentForm } from './AddStudentForm';
import { StudentDetailModal } from './StudentDetailModal';
import { StudentMobileCard } from './StudentMobileCard';
import { StudentTableRow } from './StudentTableRow';

interface StudentsProps {
  students: Student[];
  parents: Parent[];
  levels: Level[];
  onAddStudent: (std: Omit<Student, 'id'>, p: Omit<Parent, 'id'>) => void;
  onViewPdf: (studentId: string) => void;
  onUpdateStudents?: (list: Student[]) => void;
}

export const AdminStudents: React.FC<StudentsProps> = ({
  students, parents, levels, onAddStudent, onViewPdf, onUpdateStudents
}) => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleDelete = (id: string) => onUpdateStudents?.(students.filter(s => s.id !== id));
  const handleUpdateStudent = (updated: Student) => onUpdateStudents?.(students.map(s => s.id === updated.id ? updated : s));

  const filtered = students.filter(s => {
    const parent = parents.find(p => p.id === s.parentId);
    return `${s.firstName} ${s.lastName} ${parent?.fullName || ''} ${parent?.phone || ''}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Rechercher un élève..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:border-sky-500"
          />
        </div>
        <button
          id="show-add-std-btn" onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nouvel Élève
        </button>
      </div>

      {showAdd && <AddStudentForm levels={levels} parents={parents} onAddStudent={onAddStudent} onClose={() => setShowAdd(false)} />}

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map(s => (
          <StudentMobileCard
            key={s.id} student={s} parent={parents.find(p => p.id === s.parentId)}
            levelName={levels.find(l => l.id === s.levelId)?.name} onSelect={setSelectedStudent} onViewPdf={onViewPdf}
          />
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 w-[25%]">Élève</th>
                <th className="p-4 w-[15%]">Classe</th>
                <th className="p-4 w-[15%]">Sexe</th>
                <th className="p-4 w-[25%]">Parent / Contact</th>
                <th className="p-4 w-[20%] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map(s => (
                <StudentTableRow
                  key={s.id} student={s} parent={parents.find(p => p.id === s.parentId)}
                  levelName={levels.find(l => l.id === s.levelId)?.name} onSelect={setSelectedStudent} onViewPdf={onViewPdf}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent} parent={parents.find(p => p.id === selectedStudent.parentId)} levels={levels}
          onClose={() => setSelectedStudent(null)} onDelete={() => handleDelete(selectedStudent.id)} onUpdate={handleUpdateStudent}
        />
      )}
    </div>
  );
};
