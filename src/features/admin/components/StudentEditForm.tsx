import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Student, Level } from '../../../types';
import { StudentPhotoUploader } from '../../shared/components/StudentPhotoUploader';

interface StudentEditFormProps {
  student: Student;
  levels: Level[];
  onSubmit: (data: { firstName: string; lastName: string; sex: 'M' | 'F'; levelId: string; photoUrl?: string }) => void;
  onCancel: () => void;
}

const presets = {
  M: [
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250&h=250'
  ],
  F: [
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250&h=250'
  ]
};

export const StudentEditForm: React.FC<StudentEditFormProps> = ({ student, levels, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    levelId: student.levelId,
    sex: student.sex,
    photoUrl: student.photoUrl || presets[student.sex][0]
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSave} className="space-y-3.5 animate-in fade-in duration-150 select-none text-left">
      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
        <StudentPhotoUploader
          studentId={student.id}
          sex={form.sex}
          currentPhotoUrl={form.photoUrl}
          studentName={`${form.firstName} ${form.lastName}`}
          onPhotoChange={(newUrl) => setForm({ ...form, photoUrl: newUrl })}
        />
        <div className="text-[10px] text-slate-500 font-medium">
          <p className="font-bold text-slate-700">Photo d'identité d'élève</p>
          <p className="text-[9px] text-slate-400">Prendre une photo direct ou charger un fichier</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:border-sky-500 outline-none" placeholder="Prénom" />
        <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:border-sky-500 outline-none" placeholder="Nom" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select value={form.sex} onChange={(e) => { const s = e.target.value as 'M' | 'F'; setForm({ ...form, sex: s, photoUrl: presets[s][0] }); }} className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-sky-500">
          <option value="M">Garçon</option>
          <option value="F">Fille</option>
        </select>
        <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-sky-500">
          {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"><X className="w-3.5 h-3.5" /> Annuler</button>
        <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5" /> Enregistrer</button>
      </div>
    </form>
  );
};
