import React, { useRef, useState } from 'react';
import { X, Download, Printer, CheckCircle2, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toCanvas } from 'html-to-image';
import { Student, Level, Group, Assignment, Subject, Teacher, Settings } from '../../../types';
import { TimetablePdfView } from './TimetablePdfView';
import { ScreenTimetableContent } from './ScreenTimetableContent';
import { TimetableItem } from './TimetableTable';

interface StudentTimetableModalProps {
  isOpen: boolean; onClose: () => void; student: Student; level?: Level;
  groups: Group[]; assignments: Assignment[]; subjects: Subject[]; teachers: Teacher[]; settings?: Settings;
}

export const StudentTimetableModal: React.FC<StudentTimetableModalProps> = ({
  isOpen, onClose, student, level, groups, assignments, subjects, teachers, settings
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const items: TimetableItem[] = [
    ...groups.filter(g => g.studentIds.includes(student.id)).map(g => ({
      id: g.id,
      subject: subjects.find(s => s.id === g.subjectId)?.name || 'Matière',
      teacher: teachers.find(t => t.id === g.teacherId)?.fullName || 'Non assigné',
      location: g.room || 'Salle de cours',
      schedule: g.schedule,
      type: 'GROUPE' as const
    })),
    ...assignments.filter(a => a.type === 'INDIVIDUEL' && a.studentId === student.id).map(a => ({
      id: a.id,
      subject: subjects.find(s => s.id === a.subjectId)?.name || 'Matière',
      teacher: teachers.find(t => t.id === a.teacherId)?.fullName || 'Non assigné',
      location: a.location || 'Sur mesure',
      schedule: a.schedule,
      type: 'INDIVIDUEL' as const
    }))
  ];

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setLoading(true);
    try {
      const canvas = await toCanvas(printRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Emploi_du_temps_${student.firstName}_${student.lastName}.pdf`);
      setMsg('PDF téléchargé avec succès !');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      alert('Erreur lors de la génération du PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto pt-4 sm:pt-10 pb-12 text-xs select-none">
      <div className="bg-slate-100 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-white px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold shrink-0"><Calendar className="w-4 h-4" /></div>
            <div className="truncate">
              <h3 className="font-display font-bold text-slate-800 text-xs sm:text-sm truncate">Emploi du Temps : {student.firstName} {student.lastName}</h3>
              <p className="text-[10px] text-slate-400">Classe : <span className="font-bold text-slate-600">{level?.name || 'Inconnue'}</span> | Document Officiel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer shrink-0"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-slate-900 text-white px-4 sm:px-5 py-2 flex items-center justify-between gap-2 border-b border-slate-800">
          <p className="text-[10px] text-slate-300 font-medium hidden sm:block">Aperçu officiel de l'emploi du temps.</p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-[10.5px] flex items-center gap-1.5 cursor-pointer border border-slate-700"><Printer className="w-3.5 h-3.5" /> Imprimer</button>
            <button onClick={handleDownloadPDF} disabled={loading} className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold px-4 py-1.5 rounded-xl text-[10.5px] flex items-center gap-1.5 cursor-pointer shadow-sm"><Download className="w-3.5 h-3.5" /> {loading ? 'Génération...' : 'Télécharger le PDF'}</button>
          </div>
        </div>

        {msg && <div className="bg-emerald-500 text-white px-4 py-1.5 text-[10.5px] font-bold text-center flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {msg}</div>}

        <div className="p-3 sm:p-5 overflow-y-auto max-h-[75vh]">
          <ScreenTimetableContent student={student} level={level} items={items} settings={settings} />
        </div>

        <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
          <TimetablePdfView printRef={printRef} student={student} level={level} groups={groups} assignments={assignments} subjects={subjects} teachers={teachers} settings={settings} />
        </div>
      </div>
    </div>
  );
};

