import React from 'react';
import { Plus, UserMinus } from 'lucide-react';
import { Group, Student } from '../../../types';
import { SearchableSelect } from '../../shared/components/SearchableSelect';

interface GroupStudentsManagerProps {
  group: Group;
  students: Student[];
  onUpdateGroup: (grps: Group[]) => void;
  groups: Group[];
}

export function GroupStudentsManager({
  group, students, onUpdateGroup, groups
}: GroupStudentsManagerProps) {
  const [selectedStudentId, setSelectedStudentId] = React.useState('');

  const handleAddStudent = () => {
    if (!selectedStudentId) return;
    if (group.studentIds.includes(selectedStudentId)) return;
    if (group.studentIds.length >= group.maxStudents) {
      alert('Ce groupe a atteint sa capacité maximale !');
      return;
    }
    const updated = { ...group, studentIds: [...group.studentIds, selectedStudentId] };
    onUpdateGroup(groups.map(g => g.id === group.id ? updated : g));
    setSelectedStudentId('');
  };

  const handleRemoveStudent = (studentId: string) => {
    const updated = { ...group, studentIds: group.studentIds.filter(id => id !== studentId) };
    onUpdateGroup(groups.map(g => g.id === group.id ? updated : g));
  };

  const groupStudents = students.filter(s => group.studentIds.includes(s.id));
  const availableStudents = students.filter(s => !group.studentIds.includes(s.id));

  return (
    <div className="border-t border-slate-100 pt-3 space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase">
          Élèves inscrits ({groupStudents.length}/{group.maxStudents})
        </p>
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <SearchableSelect
            value={selectedStudentId}
            onChange={setSelectedStudentId}
            options={availableStudents.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }))}
            placeholder="Ajouter un élève..."
            searchPlaceholder="Rechercher élève par nom..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs text-slate-700 outline-none focus:border-sky-500"
          />
        </div>
        <button
          onClick={handleAddStudent}
          type="button"
          className="bg-sky-500 text-white p-2.5 rounded-xl hover:bg-sky-400 transition cursor-pointer flex items-center justify-center shrink-0 mb-0.5"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
        {groupStudents.map(s => (
          <div key={s.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="font-medium text-slate-700">{s.firstName} {s.lastName}</span>
            <button
              onClick={() => handleRemoveStudent(s.id)}
              type="button"
              className="text-rose-500 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
            >
              <UserMinus className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {groupStudents.length === 0 && (
          <p className="text-slate-400 text-center py-2 italic text-[11px]">Aucun élève inscrit.</p>
        )}
      </div>
    </div>
  );
}
