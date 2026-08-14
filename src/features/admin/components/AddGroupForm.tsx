import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Group, Teacher, Subject, Level, Assignment } from '../../../types';
import { SearchableSelect } from '../../shared/components/SearchableSelect';
import { ScheduleSelector } from '../../shared/components/ScheduleSelector';
import { PlanningConflictAlert } from '../../shared/components/PlanningConflictAlert';
import { findPlanningConflicts, parseScheduleSlots } from '../../shared/domain/planningDomain';

interface AddGroupFormProps {
  levels: Level[]; subjects: Subject[]; teachers: Teacher[];
  assignments?: Assignment[]; groups?: Group[];
  onAddGroup: (g: Omit<Group, 'id' | 'studentIds'>) => void; onClose: () => void;
}

export function AddGroupForm({ levels, subjects, teachers, assignments = [], groups = [], onAddGroup, onClose }: AddGroupFormProps) {
  const [f, setF] = useState({ name: '', levelId: '', subjectId: '', teacherId: '', maxStudents: 15, room: '', schedule: '' });

  const conflicts = useMemo(() => {
    const existing = [
      ...assignments.map(a => ({ id: a.id, teacherId: a.teacherId, roomOrLocation: a.location, schedule: a.schedule, title: a.type === 'INDIVIDUEL' ? 'Cours individuel' : 'Groupe' })),
      ...groups.map(g => ({ id: g.id, teacherId: g.teacherId, roomOrLocation: g.room, schedule: g.schedule, title: `Groupe: ${g.name}` }))
    ];
    return findPlanningConflicts({
      teacherId: f.teacherId, roomOrLocation: f.room, schedule: f.schedule, title: `Nouveau groupe: ${f.name || 'Sans titre'}`
    }, existing);
  }, [f.teacherId, f.room, f.schedule, f.name, assignments, groups]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slots = parseScheduleSlots(f.schedule);
    const firstSlot = slots[0];
    onAddGroup({
      ...f,
      days: slots.map(s => s.day),
      startTime: firstSlot?.startTime,
      endTime: firstSlot?.endTime,
      durationMinutes: firstSlot ? (firstSlot.endMinutes - firstSlot.startMinutes) : undefined
    });
    onClose();
  };

  const inputClass = "w-full p-2.5 rounded-xl border border-slate-200 outline-none text-slate-700 bg-slate-50/30 text-xs";
  const selectClass = "w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none text-slate-700 text-xs";
  const labelClass = "font-bold text-slate-500 uppercase text-[9px] tracking-wider block mb-1";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full text-xs overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div><h4 className="font-display font-extrabold text-slate-800 text-sm">Nouveau Groupe de Cours</h4><p className="text-[10px] text-slate-400">Enseignement collectif</p></div>
        <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-3">
        <div><label className={labelClass}>Nom du Groupe</label><input type="text" placeholder="Nom (ex: TS Math A)" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className={inputClass} required /></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className={labelClass}>Classe / Niveau</label><SearchableSelect value={f.levelId} onChange={val => setF({ ...f, levelId: val })} options={levels.map(l => ({ value: l.id, label: l.name }))} placeholder="Sélectionner classe" className={selectClass} required /></div>
          <div><label className={labelClass}>Matière</label><SearchableSelect value={f.subjectId} onChange={val => setF({ ...f, subjectId: val })} options={subjects.map(s => ({ value: s.id, label: s.name }))} placeholder="Sélectionner matière" className={selectClass} required /></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className={labelClass}>Professeur</label><SearchableSelect value={f.teacherId} onChange={val => setF({ ...f, teacherId: val })} options={teachers.map(t => ({ value: t.id, label: t.fullName }))} placeholder="Sélectionner prof" className={selectClass} required /></div>
          <div><label className={labelClass}>Capacité maximale</label><input type="number" value={f.maxStudents} onChange={e => setF({ ...f, maxStudents: Number(e.target.value) })} className={inputClass} required /></div>
        </div>

        <div><label className={labelClass}>Salle de Cours</label><input type="text" placeholder="Salle (ex: Salle Einstein)" value={f.room} onChange={e => setF({ ...f, room: e.target.value })} className={inputClass} required /></div>
        <ScheduleSelector value={f.schedule} onChange={val => setF({ ...f, schedule: val })} label="Planning / Horaire du cours" />
        <PlanningConflictAlert conflicts={conflicts} />

        <div className="flex gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition">Annuler</button>
          <button type="submit" id="submit-add-grp-btn" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow-xs">Créer le Groupe</button>
        </div>
      </form>
    </div>
  );
}
