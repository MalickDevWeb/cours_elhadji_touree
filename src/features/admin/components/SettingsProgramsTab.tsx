import React, { useState } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Subject, Level } from '../../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ProgramSection } from './ProgramSection';

interface ProgramsProps {
  subjects: Subject[];
  onUpdateSubjects: (s: Subject[]) => void;
  levels: Level[];
  onUpdateLevels: (l: Level[]) => void;
}

export const SettingsProgramsTab: React.FC<ProgramsProps> = ({
  subjects, onUpdateSubjects, levels, onUpdateLevels
}) => {
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'LEVEL' | 'SUBJECT' } | null>(null);

  const addSubject = (name: string) => {
    const newSub: Subject = { id: `sub-${Date.now()}`, name, active: true };
    onUpdateSubjects([...subjects, newSub]);
  };

  const addLevel = (name: string) => {
    const newLvl: Level = { id: `lvl-${Date.now()}`, name };
    onUpdateLevels([...levels, newLvl]);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'SUBJECT') {
      onUpdateSubjects(subjects.filter(s => s.id !== itemToDelete.id));
    } else {
      onUpdateLevels(levels.filter(l => l.id !== itemToDelete.id));
    }
    setItemToDelete(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-5 animate-in fade-in duration-150">
      <ProgramSection
        title="Niveaux Scolaires"
        icon={GraduationCap}
        iconColor="text-indigo-500"
        placeholder="Ex: Terminale, 3e, CM2..."
        items={levels}
        onAdd={addLevel}
        onRemove={id => {
          const l = levels.find(item => item.id === id);
          if (l) setItemToDelete({ id, name: l.name, type: 'LEVEL' });
        }}
      />

      <ProgramSection
        title="Matières d'Enseignement"
        icon={BookOpen}
        iconColor="text-amber-500"
        placeholder="Ex: Mathématiques, SVT..."
        items={subjects}
        onAdd={addSubject}
        onRemove={id => {
          const s = subjects.find(item => item.id === id);
          if (s) setItemToDelete({ id, name: s.name, type: 'SUBJECT' });
        }}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
        title={itemToDelete?.type === 'SUBJECT' ? "Supprimer la matière" : "Supprimer le niveau Scolaire"}
      />
    </div>
  );
};
