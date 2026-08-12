import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Teacher, Subject, Level } from '../../../types';
import { TeacherCard } from './TeacherCard';
import { AddTeacherForm } from './AddTeacherForm';

interface TeachersProps {
  teachers: Teacher[];
  subjects: Subject[];
  levels: Level[];
  onAddTeacher: (t: Omit<Teacher, 'id'>) => void;
  onUpdateTeachers?: (list: Teacher[]) => void;
}

export const AdminTeachers: React.FC<TeachersProps> = ({
  teachers, subjects, levels, onAddTeacher, onUpdateTeachers,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ subjects: [] as string[], levels: [] as string[] });

  const handleStartEdit = (t: Teacher) => {
    setEditingId(t.id);
    setEditForm({ subjects: t.subjects, levels: t.levels });
  };

  const handleSaveEdit = (t: Teacher) => {
    onUpdateTeachers?.(teachers.map(x => x.id === t.id ? { ...x, subjects: editForm.subjects, levels: editForm.levels } : x));
    setEditingId(null);
  };

  const toggleSub = (id: string, isNew: boolean) => {
    const active = editForm.subjects;
    const updated = active.includes(id) ? active.filter(s => s !== id) : [...active, id];
    setEditForm({ ...editForm, subjects: updated });
  };

  const toggleLvl = (id: string, isNew: boolean) => {
    const active = editForm.levels;
    const updated = active.includes(id) ? active.filter(l => l !== id) : [...active, id];
    setEditForm({ ...editForm, levels: updated });
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
        <h3 className="font-display font-bold text-slate-800 text-base">Nos Professeurs</h3>
        <button
          id="show-add-teacher-btn" onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Ajouter un Professeur
        </button>
      </div>

      {showAdd && (
        <AddTeacherForm
          subjects={subjects} levels={levels}
          onAddTeacher={onAddTeacher} onClose={() => setShowAdd(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(t => (
          <TeacherCard
            key={t.id} teacher={t} subjects={subjects} levels={levels}
            editingId={editingId} editForm={editForm}
            onStartEdit={handleStartEdit} onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setEditingId(null)}
            onToggleSub={toggleSub} onToggleLvl={toggleLvl}
          />
        ))}
      </div>
    </div>
  );
};
