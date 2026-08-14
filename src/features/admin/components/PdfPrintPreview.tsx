import React from 'react';
import { Student, Parent, Payment, Level, Subject, Assignment, Group, Settings } from '../../../types';
import { ReceiptPdfSheet } from './ReceiptPdfSheet';
import { StudentPdfSheet } from './StudentPdfSheet';
import { AttendanceRecord } from '../../parent/domain/parentMockData';

interface PdfPrintPreviewProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  type: 'FICHE_ELEVE' | 'RECEIPT';
  payment?: Payment; student: Student; parent?: Parent; level?: Level;
  studentPayments: Payment[]; studentAssignments: Assignment[]; studentGroups: Group[];
  subjects: Subject[]; settings: Settings; attendanceHistory?: Record<string, AttendanceRecord[]>;
}

export const PdfPrintPreview: React.FC<PdfPrintPreviewProps> = ({
  printRef, type, payment, student, parent, level, studentPayments,
  studentAssignments, studentGroups, subjects, settings, attendanceHistory = {}
}) => {
  const studentAttendance = student ? (attendanceHistory[student.id] || []) : [];

  return (
    <div className="lg:col-span-2 p-3 sm:p-5 flex justify-center bg-slate-200/90 overflow-y-auto max-h-[82vh]">
      <div ref={printRef} className="bg-white w-[210mm] max-w-full p-5 sm:p-7 text-slate-800 font-sans shadow-xl rounded-xl relative flex flex-col justify-between text-xs leading-relaxed border border-slate-200">
        <div>
          <div className="border-b-2 border-sky-500 pb-3 mb-4 flex justify-between items-start">
            <div>
              <h1 className="text-lg font-black text-slate-900 font-display uppercase tracking-tight">{settings.centerName}</h1>
              <p className="text-[10px] font-bold text-sky-600 uppercase mt-0.5">Soutien Scolaire d'Excellence</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Directeur : {settings.directorName}</p>
            </div>
            <div className="text-right text-[9px] text-slate-500 space-y-0.5">
              <p className="font-bold text-slate-800">Thiès, Sénégal</p>
              <p>Tél : {settings.phone}</p>
              <p>WhatsApp : {settings.whatsapp}</p>
              <p className="text-slate-400">Émission : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {type === 'RECEIPT' && payment && (
              <ReceiptPdfSheet payment={payment} student={student} parent={parent} level={level} settings={settings} attendanceRecords={studentAttendance} />
            )}
            {type === 'FICHE_ELEVE' && (
              <StudentPdfSheet student={student} parent={parent} level={level} studentPayments={studentPayments} studentAssignments={studentAssignments} studentGroups={studentGroups} subjects={subjects} />
            )}
          </div>
        </div>

        <div className="pt-5 border-t border-slate-200 mt-5">
          <div className="grid grid-cols-2 text-center text-[10px] text-slate-500">
            <div className="flex flex-col justify-between h-12">
              <p className="font-bold text-slate-600 uppercase tracking-wider text-[9px]">Le Parent / Déposant</p>
              <p className="italic text-[8.5px] text-slate-400">(Lu et approuvé)</p>
            </div>
            <div className="flex flex-col justify-between h-12">
              <p className="font-bold text-slate-600 uppercase tracking-wider text-[9px]">La Direction / Caisse</p>
              <p className="font-display font-black text-slate-900 text-[10.5px] uppercase">{settings.directorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

