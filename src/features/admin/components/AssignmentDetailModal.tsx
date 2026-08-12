import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Assignment, Group, Student, Teacher, Subject, Level } from '../../../types';
import { GroupStudentsManager } from './GroupStudentsManager';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ScheduleSelector } from '../../shared/components/ScheduleSelector';

interface Props {
  assignment: Assignment;
  group?: Group;
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  levels: Level[];
  assignments: Assignment[];
  groups: Group[];
  onUpdateAssignment: (asgs: Assignment[]) => void;
  onUpdateGroup: (grps: Group[]) => void;
  onClose: () => void;
}

export function AssignmentDetailModal({
  assignment, group, students, teachers, subjects, levels,
  assignments, groups, onUpdateAssignment, onUpdateGroup, onClose
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState(assignment.schedule);
  const [location, setLocation] = useState(assignment.location);
  const [teacherId, setTeacherId] = useState(assignment.teacherId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => setShowDeleteConfirm(true);

  const handleSave = () => {
    onUpdateAssignment(assignments.map(a => a.id === assignment.id ? { ...a, schedule, location, teacherId } : a));
    if (group) {
      onUpdateGroup(groups.map(g => g.id === group.id ? { ...g, schedule, room: location, teacherId } : g));
    }
    setIsEditing(false);
  };

  const currentTeacher = teachers.find(t => t.id === teacherId);
  const currentSubject = subjects.find(s => s.id === assignment.subjectId);
  const currentStudent = assignment.studentId ? students.find(s => s.id === assignment.studentId) : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <span className={`px-2 py-0.5 rounded-[6px] text-[8px] font-black uppercase tracking-wider ${assignment.type === 'INDIVIDUEL' ? 'bg-amber-50 text-amber-600 border border-amber-250' : 'bg-sky-50 text-sky-600 border border-sky-250'}`}>{assignment.type}</span>
          <h4 className="font-display font-extrabold text-slate-800 text-sm mt-1">{assignment.type === 'INDIVIDUEL' ? `Cours : ${currentStudent?.firstName} ${currentStudent?.lastName}` : `Groupe : ${group?.name}`}</h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{currentSubject?.name}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-250/60 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-6 space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <ScheduleSelector value={schedule} onChange={setSchedule} label="Horaire" />
            <div><label className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Lieu / Salle</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full mt-1 p-3 border border-slate-200 rounded-xl" /></div>
            <div>
              <label className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Professeur</label>
              <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-white text-slate-700">
                {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Horaire</p><p className="font-semibold text-slate-700 mt-1">{schedule}</p></div>
            <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lieu / Salle</p><p className="font-semibold text-slate-700 mt-1">{location}</p></div>
            <div className="col-span-2"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Professeur</p><p className="font-semibold text-slate-700 mt-1">{currentTeacher?.fullName}</p></div>
          </div>
        )}

        {assignment.type === 'GROUPE' && group && (
          <GroupStudentsManager group={group} students={students} onUpdateGroup={onUpdateGroup} groups={groups} />
        )}

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button onClick={handleDelete} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-3 rounded-xl transition flex gap-1.5 items-center justify-center cursor-pointer shadow-2xs"><Trash2 className="w-4 h-4" /> Supprimer</button>
          <div className="flex-1 flex gap-2 justify-end">
            {isEditing ? (
              <>
                <button onClick={() => { setIsEditing(false); setSchedule(assignment.schedule); setLocation(assignment.location); setTeacherId(assignment.teacherId); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl transition cursor-pointer">Annuler</button>
                <button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-xl transition cursor-pointer">Enregistrer</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl transition cursor-pointer">Modifier</button>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => { onUpdateAssignment(assignments.filter(a => a.id !== assignment.id)); onClose(); }}
        itemName={`${currentSubject?.name} (${schedule})`}
        title="Supprimer le cours"
      />
    </div>
  );
}
