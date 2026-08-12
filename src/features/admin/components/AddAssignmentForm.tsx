import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Assignment, Student, Teacher, Subject, Group } from '../../../types';
import { SearchableSelect } from '../../shared/components/SearchableSelect';
import { ScheduleSelector } from '../../shared/components/ScheduleSelector';

interface AddAssignmentFormProps {
  students: Student[]; teachers: Teacher[]; subjects: Subject[]; groups: Group[];
  onAddAssignment: (asg: Omit<Assignment, 'id'>) => void; onClose: () => void;
}

export function AddAssignmentForm({ students, teachers, subjects, groups, onAddAssignment, onClose }: AddAssignmentFormProps) {
  const [f, setF] = useState({ type: 'INDIVIDUEL' as 'INDIVIDUEL' | 'GROUPE', studentId: '', groupId: '', teacherId: '', subjectId: '', schedule: '', location: '' });

  const handleSaveAsg = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAssignment({
      type: f.type, studentId: f.type === 'INDIVIDUEL' ? f.studentId : undefined,
      groupId: f.type === 'GROUPE' ? f.groupId : undefined,
      teacherId: f.teacherId, subjectId: f.subjectId, schedule: f.schedule, location: f.location
    });
    onClose();
  };

  const inputCls = "w-full p-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition text-slate-700 bg-slate-50/30 text-xs";
  const selectCls = "w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none transition text-slate-700 text-xs";
  const labelCls = "font-bold text-slate-500 uppercase text-[9px] tracking-wider block mb-1";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full text-xs animate-in fade-in zoom-in-95 duration-200 my-auto sm:my-0">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h4 className="font-display font-extrabold text-slate-800 text-sm">Affectation & Planification de Cours</h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Lier un professeur à un élève individuel ou un groupe</p>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"><X className="w-4 h-4" /></button>
      </div>

      <form onSubmit={handleSaveAsg} className="p-5 space-y-3.5">
        <div>
          <label className={labelCls}>Format du Cours</label>
          <div className="flex gap-2">
            {['INDIVIDUEL', 'GROUPE'].map((t) => (
              <button key={t} type="button" onClick={() => setF({ ...f, type: t as any })} className={`flex-1 py-2 rounded-xl font-bold border text-center transition cursor-pointer text-xs ${f.type === t ? 'bg-sky-50/70 border-sky-300 text-sky-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                {t === 'INDIVIDUEL' ? 'Élève Individuel' : 'Groupe / Salle'}
              </button>
            ))}
          </div>
        </div>

        {f.type === 'INDIVIDUEL' ? (
          <div>
            <label className={labelCls}>Élève inscrit individuellement</label>
            <SearchableSelect value={f.studentId} onChange={v => setF({ ...f, studentId: v })} options={students.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }))} placeholder="Sélectionner l'élève" searchPlaceholder="Rechercher élève..." className={selectCls} required />
          </div>
        ) : (
          <div>
            <label className={labelCls}>Groupe de Cours / Salle</label>
            <SearchableSelect value={f.groupId} onChange={v => setF({ ...f, groupId: v })} options={groups.map(g => ({ value: g.id, label: `${g.name} (${g.room})` }))} placeholder="Sélectionner le groupe" searchPlaceholder="Rechercher groupe..." className={selectCls} required />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Professeur affecté</label>
            <SearchableSelect value={f.teacherId} onChange={v => setF({ ...f, teacherId: v })} options={teachers.map(t => ({ value: t.id, label: t.fullName }))} placeholder="Choisir un professeur" searchPlaceholder="Rechercher prof..." className={selectCls} required />
          </div>
          <div>
            <label className={labelCls}>Matière</label>
            <SearchableSelect value={f.subjectId} onChange={v => setF({ ...f, subjectId: v })} options={subjects.map(s => ({ value: s.id, label: s.name }))} placeholder="Choisir la matière" searchPlaceholder="Rechercher matière..." className={selectCls} required />
          </div>
        </div>

        <div>
          <label className={labelCls}>Salle / Lieu de cours</label>
          <input type="text" placeholder="ex: Salle Einstein ou Domicile" value={f.location} onChange={e => setF({ ...f, location: e.target.value })} className={inputCls} required />
        </div>

        <ScheduleSelector value={f.schedule} onChange={val => setF({ ...f, schedule: val })} />

        <div className="flex gap-3 pt-3.5 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer text-center text-xs">Annuler</button>
          <button type="submit" id="submit-add-asg-btn" className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl transition shadow-xs cursor-pointer text-center text-xs">Valider l'affectation</button>
        </div>
      </form>
    </div>
  );
}
