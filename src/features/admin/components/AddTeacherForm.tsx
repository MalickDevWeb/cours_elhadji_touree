import React, { useState } from 'react';
import { Teacher, Subject, Level } from '../../../types';
import { ScheduleSelector } from '../../shared/components/ScheduleSelector';

interface AddTeacherFormProps {
  subjects: Subject[];
  levels: Level[];
  onAddTeacher: (t: Omit<Teacher, 'id'>) => void;
  onClose: () => void;
}

export const AddTeacherForm: React.FC<AddTeacherFormProps> = ({
  subjects, levels, onAddTeacher, onClose
}) => {
  const [form, setForm] = useState({
    fullName: '', phone: '', address: '',
    selectedSubjects: [] as string[], selectedLevels: [] as string[],
    availabilities: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTeacher({
      fullName: form.fullName, phone: form.phone, address: form.address,
      subjects: form.selectedSubjects, levels: form.selectedLevels, availabilities: form.availabilities
    });
    onClose();
  };

  const toggleSub = (id: string) => {
    const updated = form.selectedSubjects.includes(id)
      ? form.selectedSubjects.filter(s => s !== id)
      : [...form.selectedSubjects, id];
    setForm({ ...form, selectedSubjects: updated });
  };

  const toggleLvl = (id: string) => {
    const updated = form.selectedLevels.includes(id)
      ? form.selectedLevels.filter(l => l !== id)
      : [...form.selectedLevels, id];
    setForm({ ...form, selectedLevels: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 max-w-xl mx-auto text-xs">
      <input type="text" placeholder="Nom complet" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none" required />
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder="Téléphone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="p-2.5 rounded-xl border border-slate-200 outline-none" required />
        <input type="text" placeholder="Adresse" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="p-2.5 rounded-xl border border-slate-200 outline-none" required />
      </div>
      <div className="space-y-2">
        <p className="font-semibold text-slate-600">Matières :</p>
        <div className="flex flex-wrap gap-1">
          {subjects.map(s => <button key={s.id} type="button" onClick={() => toggleSub(s.id)} className={`px-2 py-1 rounded text-[9px] border transition cursor-pointer ${form.selectedSubjects.includes(s.id) ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{s.name}</button>)}
        </div>
        <p className="font-semibold text-slate-600">Classes :</p>
        <div className="flex flex-wrap gap-1">
          {levels.map(l => <button key={l.id} type="button" onClick={() => toggleLvl(l.id)} className={`px-2 py-1 rounded text-[9px] border transition cursor-pointer ${form.selectedLevels.includes(l.id) ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{l.name}</button>)}
        </div>
      </div>
      <ScheduleSelector value={form.availabilities} onChange={val => setForm({...form, availabilities: val})} label="Créneaux de Disponibilités" />
      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition cursor-pointer">Enregistrer le professeur</button>
    </form>
  );
};
