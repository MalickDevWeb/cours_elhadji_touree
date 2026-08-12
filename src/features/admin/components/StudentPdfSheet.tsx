import React from 'react';
import { Student, Parent, Level, Subject, Assignment, Group, Payment } from '../../../types';
import { getStudentPhoto } from '../../shared/components/StudentCardBody';

interface StudentPdfSheetProps {
  student: Student; parent?: Parent; level?: Level;
  studentPayments: Payment[]; studentAssignments: Assignment[]; studentGroups: Group[]; subjects: Subject[];
}

export const StudentPdfSheet: React.FC<StudentPdfSheetProps> = ({
  student, parent, level, studentPayments, studentAssignments, studentGroups, subjects
}) => {
  const photoUrl = student.photoUrl || getStudentPhoto(student.id, student.sex);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={photoUrl} alt="" className="w-11 h-13 rounded-xl object-cover border-2 border-sky-500 shadow-xs shrink-0" referrerPolicy="no-referrer" />
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dossier Académique</p>
            <h2 className="text-sm font-bold text-slate-800 mt-0.5">{student.firstName} {student.lastName}</h2>
            <p className="text-[10px] text-slate-500">Fiche Individuelle d'Information</p>
          </div>
        </div>
        <span className="bg-sky-50 text-sky-600 border border-sky-200 text-[10px] font-bold px-3 py-1 rounded-xl">Classe : {level?.name || 'Non définie'}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-0.5">Identité de l'élève</h3>
          <p className="text-xs"><strong>Prénom :</strong> {student.firstName}</p>
          <p className="text-xs"><strong>Nom :</strong> {student.lastName}</p>
          <p className="text-xs"><strong>Sexe :</strong> {student.sex === 'M' ? 'Garçon' : 'Fille'}</p>
          <p className="text-xs"><strong>Né(e) le :</strong> {student.birthDate ? new Date(student.birthDate).toLocaleDateString('fr-FR') : '-'}</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-0.5">Responsable Légal</h3>
          <p className="text-xs"><strong>Parent :</strong> {parent?.fullName || 'N/A'}</p>
          <p className="text-xs"><strong>Téléphone :</strong> {parent?.phone || 'N/A'}</p>
          <p className="text-xs"><strong>WhatsApp :</strong> {parent?.whatsapp || 'N/A'}</p>
          <p className="text-xs truncate"><strong>Adresse :</strong> {parent?.address || 'N/A'}</p>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-0.5">Cours et Emploi du Temps</h3>
        {studentAssignments.length === 0 && studentGroups.length === 0 ? (
          <p className="text-slate-400 text-[10px] italic py-0.5">Aucun cours planifié pour cet élève dans le système.</p>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                  <th className="p-1.5">Type</th><th className="p-1.5">Matière</th><th className="p-1.5">Horaire</th><th className="p-1.5">Lieu / Salle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {studentAssignments.map(a => (
                  <tr key={a.id}><td className="p-1.5 font-bold text-amber-600 uppercase">Individuel</td><td className="p-1.5 font-semibold text-slate-800">{subjects.find(s => s.id === a.subjectId)?.name}</td><td className="p-1.5">{a.schedule}</td><td className="p-1.5">{a.location}</td></tr>
                ))}
                {studentGroups.map(g => (
                  <tr key={g.id}><td className="p-1.5 font-bold text-sky-600 uppercase">Groupe ({g.name})</td><td className="p-1.5 font-semibold text-slate-800">{subjects.find(s => s.id === g.subjectId)?.name}</td><td className="p-1.5">{g.schedule}</td><td className="p-1.5">Salle {g.room}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="space-y-1.5 pt-1">
        <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-0.5">Historique des versements</h3>
        {studentPayments.length === 0 ? (
          <p className="text-slate-400 text-[10px] italic py-0.5">Aucun versement enregistré à ce jour.</p>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                  <th className="p-1.5">Référence</th><th className="p-1.5">Date</th><th className="p-1.5">Méthode</th><th className="p-1.5 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {studentPayments.map(p => (
                  <tr key={p.id}><td className="p-1.5 font-mono font-bold text-slate-500">{p.reference}</td><td className="p-1.5">{p.date}</td><td className="p-1.5">{p.method}</td><td className="p-1.5 text-right font-bold text-slate-800">{p.amount.toLocaleString()} FCFA</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
