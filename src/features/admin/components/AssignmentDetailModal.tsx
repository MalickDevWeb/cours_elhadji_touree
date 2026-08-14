import React, { useState, useMemo } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Assignment, Group, Student, Teacher, Subject, Level } from '../../../types';
import { GroupStudentsManager } from './GroupStudentsManager';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ScheduleSelector } from '../../shared/components/ScheduleSelector';
import { PlanningConflictAlert } from '../../shared/components/PlanningConflictAlert';
import { findPlanningConflicts, parseScheduleSlots } from '../../shared/domain/planningDomain';

interface Props {
  assignment: Assignment; group?: Group; students: Student[]; teachers: Teacher[];
  subjects: Subject[]; levels: Level[]; assignments: Assignment[]; groups: Group[];
  onUpdateAssignment: (asgs: Assignment[]) => void; onUpdateGroup: (grps: Group[]) => void; onClose: () => void;
}

export function AssignmentDetailModal({
  assignment, group, students, teachers, subjects, assignments, groups, onUpdateAssignment, onUpdateGroup, onClose
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState(assignment.schedule);
  const [location, setLocation] = useState(assignment.location);
  const [teacherId, setTeacherId] = useState(assignment.teacherId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const conflicts = useMemo(() => {
    if (!isEditing) return [];
    const otherAsgs = assignments.filter(a => a.id !== assignment.id).map(a => ({
      id: a.id, teacherId: a.teacherId, roomOrLocation: a.location, schedule: a.schedule,
      title: a.type === 'INDIVIDUEL' ? 'Cours individuel' : 'Groupe'
    }));
    return findPlanningConflicts({
      id: assignment.id, teacherId, roomOrLocation: location, schedule,
      title: assignment.type === 'INDIVIDUEL' ? 'Cours modifié' : `Groupe: ${group?.name || ''}`
    }, otherAsgs);
  }, [isEditing, assignment.id, assignment.type, teacherId, location, schedule, assignments, group?.name]);

  const handleSave = () => {
    const slots = parseScheduleSlots(schedule);
    const first = slots[0];
    const structured = {
      days: slots.map(s => s.day), startTime: first?.startTime, endTime: first?.endTime,
      durationMinutes: first ? (first.endMinutes - first.startMinutes) : undefined
    };
    onUpdateAssignment(assignments.map(a => a.id === assignment.id ? { ...a, schedule, location, teacherId, ...structured } : a));
    if (group) onUpdateGroup(groups.map(g => g.id === group.id ? { ...g, schedule, room: location, teacherId, ...structured } : g));
    setIsEditing(false);
  };

  const currentTeacher = teachers.find(t => t.id === teacherId);
  const currentSubject = subjects.find(s => s.id === assignment.subjectId);
  const currentStudent = assignment.studentId ? students.find(s => s.id === assignment.studentId) : null;
  const asgTitle = assignment.type === 'INDIVIDUEL' ? `Cours : ${currentStudent?.firstName || ''} ${currentStudent?.lastName || ''}` : `Groupe : ${group?.name || ''}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${assignment.type === 'INDIVIDUEL' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-sky-50 text-sky-600 border border-sky-200'}`}>{assignment.type}</span>
          <h4 className="font-display font-extrabold text-slate-800 text-sm mt-0.5">{asgTitle}</h4>
          <p className="text-[10px] text-slate-400 font-medium">{currentSubject?.name}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-5 space-y-3.5">
        {isEditing ? (
          <div className="space-y-2.5">
            <ScheduleSelector value={schedule} onChange={setSchedule} label="Horaire" />
            <PlanningConflictAlert conflicts={conflicts} />
            <div><label className="font-bold text-slate-500 uppercase text-[9px]">Lieu / Salle</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl" /></div>
            <div>
              <label className="font-bold text-slate-500 uppercase text-[9px]">Professeur</label>
              <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl bg-white text-slate-700">
                {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <div><p className="text-[9px] font-bold text-slate-400 uppercase">Horaire</p><p className="font-semibold text-slate-700 mt-0.5">{schedule}</p></div>
            <div><p className="text-[9px] font-bold text-slate-400 uppercase">Lieu / Salle</p><p className="font-semibold text-slate-700 mt-0.5">{location}</p></div>
            <div className="col-span-2"><p className="text-[9px] font-bold text-slate-400 uppercase">Professeur</p><p className="font-semibold text-slate-700 mt-0.5">{currentTeacher?.fullName}</p></div>
          </div>
        )}

        {assignment.type === 'GROUPE' && group && <GroupStudentsManager group={group} students={students} onUpdateGroup={onUpdateGroup} groups={groups} />}

        <div className="flex gap-3 pt-3 border-t border-slate-100">
          <button onClick={() => setShowDeleteConfirm(true)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-xl transition flex gap-1 items-center cursor-pointer text-xs"><Trash2 className="w-3.5 h-3.5" /> Supprimer</button>
          <div className="flex-1 flex gap-2 justify-end">
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={() => { setIsEditing(false); setSchedule(assignment.schedule); setLocation(assignment.location); setTeacherId(assignment.teacherId); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs">Annuler</button>
                <button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs">Enregistrer</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs">Modifier</button>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={() => { onUpdateAssignment(assignments.filter(a => a.id !== assignment.id)); onClose(); }} itemName={`${currentSubject?.name} (${schedule})`} title="Supprimer le cours" />
    </div>
  );
}
