import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Parent, Student } from '../../../types';
import { ParentMobileCard } from './ParentMobileCard';
import { ParentTableRow } from './ParentTableRow';

interface ParentsProps {
  parents: Parent[];
  students: Student[];
  onUpdateParents: (list: Parent[]) => void;
  onUpdateStudents: (list: Student[]) => void;
}

export function AdminParents({ parents, students, onUpdateParents, onUpdateStudents }: ParentsProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', whatsapp: '', address: '', email: '' });
  const [associatingParentId, setAssociatingParentId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const handleEdit = (p: Parent) => {
    setEditingId(p.id);
    setEditForm({ fullName: p.fullName, phone: p.phone, whatsapp: p.whatsapp, address: p.address, email: p.email || '' });
  };

  const handleSaveEdit = (id: string) => {
    onUpdateParents(parents.map(p => p.id === id ? { ...p, ...editForm } : p));
    setEditingId(null);
  };

  const handleToggleEmailNotifs = (parentId: string) => {
    onUpdateParents(parents.map(p => p.id === parentId ? { ...p, emailNotificationsEnabled: !(p.emailNotificationsEnabled !== false) } : p));
  };

  const handleAssociate = (parentId: string) => {
    if (!selectedStudentId) return;
    onUpdateStudents(students.map(s => s.id === selectedStudentId ? { ...s, parentId } : s));
    setAssociatingParentId(null); setSelectedStudentId('');
  };

  const filteredParents = parents.filter(p =>
    `${p.fullName} ${p.phone} ${p.address} ${p.email || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Rechercher un parent..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredParents.map(p => (
          <ParentMobileCard
            key={p.id} parent={p} students={students}
            isEditing={editingId === p.id} isAssociating={associatingParentId === p.id}
            editForm={editForm} setEditForm={setEditForm}
            selectedStudentId={selectedStudentId} setSelectedStudentId={setSelectedStudentId}
            onEdit={() => handleEdit(p)} onSave={() => handleSaveEdit(p.id)} onCancelEdit={() => setEditingId(null)}
            onStartAssociate={() => setAssociatingParentId(p.id)} onCancelAssociate={() => setAssociatingParentId(null)}
            onAssociate={() => handleAssociate(p.id)} onToggleEmailNotifs={() => handleToggleEmailNotifs(p.id)}
          />
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="w-full">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 w-[22%]">Parent</th>
                <th className="p-4 w-[28%]">Coordonnées & E-mail</th>
                <th className="p-4 w-[18%]">Adresse</th>
                <th className="p-4 w-[18%]">Enfants</th>
                <th className="p-4 w-[14%] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParents.map(p => (
                <ParentTableRow
                  key={p.id} parent={p} students={students}
                  isEditing={editingId === p.id} isAssociating={associatingParentId === p.id}
                  editForm={editForm} setEditForm={setEditForm}
                  selectedStudentId={selectedStudentId} setSelectedStudentId={setSelectedStudentId}
                  onEdit={() => handleEdit(p)} onSave={() => handleSaveEdit(p.id)} onCancelEdit={() => setEditingId(null)}
                  onStartAssociate={() => setAssociatingParentId(p.id)} onCancelAssociate={() => setAssociatingParentId(null)}
                  onAssociate={() => handleAssociate(p.id)} onToggleEmailNotifs={() => handleToggleEmailNotifs(p.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
