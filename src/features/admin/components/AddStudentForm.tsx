import React, { useState } from 'react';
import { Student, Parent, Level } from '../../../types';
import { StudentPhotoUploader } from '../../shared/components/StudentPhotoUploader';
import { arePhonesEqual } from '../../shared/utils/phoneUtils';
import { CheckCircle2 } from 'lucide-react';

interface AddStudentFormProps {
  levels: Level[];
  parents?: Parent[];
  onAddStudent: (std: Omit<Student, 'id'>, p: Omit<Parent, 'id'>) => void;
  onClose: () => void;
}

export function AddStudentForm({ levels, parents = [], onAddStudent, onClose }: AddStudentFormProps) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', sex: 'M' as 'M' | 'F', birthDate: '', levelId: levels[0]?.id || '', photoUrl: '', parentName: '', parentPhone: '', parentAddress: '',
  });

  const matchedParent = parents.find(p => arePhonesEqual(p.phone, form.parentPhone));

  const handlePhoneChange = (phoneVal: string) => {
    const existing = parents.find(p => arePhonesEqual(p.phone, phoneVal));
    if (existing) {
      setForm(prev => ({
        ...prev,
        parentPhone: phoneVal,
        parentName: existing.fullName,
        parentAddress: existing.address
      }));
    } else {
      setForm(prev => ({ ...prev, parentPhone: phoneVal }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(
      { firstName: form.firstName, lastName: form.lastName, sex: form.sex, birthDate: form.birthDate, levelId: form.levelId, parentId: '', photoUrl: form.photoUrl || undefined },
      { fullName: form.parentName, phone: form.parentPhone, whatsapp: form.parentPhone, address: form.parentAddress }
    );
    onClose();
  };

  return (
    <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-3 max-w-lg mx-auto text-xs animate-in fade-in duration-150">
      <h3 className="font-display font-bold text-slate-800 text-sm">Inscription manuelle d'un élève</h3>
      
      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <StudentPhotoUploader
          studentId="new"
          sex={form.sex}
          currentPhotoUrl={form.photoUrl}
          studentName={`${form.firstName || 'Élève'} ${form.lastName}`}
          onPhotoChange={(newUrl) => setForm({ ...form, photoUrl: newUrl })}
        />
        <div className="text-[10px] text-slate-500 font-medium">
          <p className="font-bold text-slate-700">Photo d'identité</p>
          <p className="text-[9px] text-slate-400">Ajouter une photo pour la carte & la fiche PDF</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Prénom de l'élève" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none" required />
        <input type="text" placeholder="Nom de l'élève" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none" required />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value as 'M' | 'F' })} className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 bg-white outline-none">
          <option value="M">Garçon</option>
          <option value="F">Fille</option>
        </select>
        <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className="p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none" required />
      </div>

      <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 bg-white outline-none">
        {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>

      <hr className="border-slate-100" />
      
      <div className="space-y-2">
        <div>
          <input type="text" placeholder="Téléphone du parent (Ex: 77 123 45 67)" value={form.parentPhone} onChange={(e) => handlePhoneChange(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-medium" required />
          {matchedParent && (
            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Parent existant reconnu : {matchedParent.fullName} ({matchedParent.address})
            </p>
          )}
        </div>
        <input type="text" placeholder="Nom complet du parent" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none" required />
        <input type="text" placeholder="Adresse complète" value={form.parentAddress} onChange={(e) => setForm({ ...form, parentAddress: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none" required />
      </div>

      <div className="flex gap-2 pt-1.5">
        <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer">Annuler</button>
        <button type="submit" id="submit-add-std-btn" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition cursor-pointer">Inscrire l'élève</button>
      </div>
    </form>
  );
}

