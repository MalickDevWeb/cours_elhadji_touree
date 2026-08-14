import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Student, Parent, Payment, Level, Subject, Assignment, Group, Settings } from '../../../types';
import { exportElementToPdf } from '../utils/pdfExporter';
import { PdfPrintPreview } from './PdfPrintPreview';
import { PdfActionsSidebar } from './PdfActionsSidebar';

interface AdminPdfModalProps {
  isOpen: boolean; onClose: () => void; type: 'FICHE_ELEVE' | 'RECEIPT';
  studentId?: string; paymentId?: string; students: Student[]; parents: Parent[];
  levels: Level[]; subjects: Subject[]; assignments: Assignment[]; groups: Group[];
  payments: Payment[]; settings: Settings; attendanceHistory?: Record<string, any[]>;
}

export const AdminPdfModal: React.FC<AdminPdfModalProps> = ({
  isOpen, onClose, type, studentId, paymentId, students, parents, levels,
  subjects, assignments, groups, payments, settings, attendanceHistory = {}
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [emailForm, setEmailForm] = useState({ show: false, email: '', sent: false });

  if (!isOpen) return null;

  let student: Student | undefined; let parent: Parent | undefined;
  let payment: Payment | undefined; let level: Level | undefined;
  let studentPayments: Payment[] = []; let studentAssignments: Assignment[] = []; let studentGroups: Group[] = [];

  if (type === 'RECEIPT' && paymentId) {
    payment = payments.find(p => p.id === paymentId);
    if (payment) {
      student = students.find(s => s.id === payment!.studentId);
      if (student) { parent = parents.find(p => p.id === student!.parentId); level = levels.find(l => l.id === student!.levelId); }
    }
  } else if (type === 'FICHE_ELEVE' && studentId) {
    student = students.find(s => s.id === studentId);
    if (student) {
      parent = parents.find(p => p.id === student!.parentId); level = levels.find(l => l.id === student!.levelId);
      studentPayments = payments.filter(p => p.studentId === student!.id);
      studentAssignments = assignments.filter(a => a.studentId === student!.id);
      studentGroups = groups.filter(g => g.studentIds.includes(student!.id));
    }
  }

  if (!student) return null;
  const showToast = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setLoading(true);
    try {
      const fileName = type === 'RECEIPT' ? `Recu_${payment?.reference || 'NA'}.pdf` : `Fiche_${student?.firstName}_${student?.lastName}.pdf`;
      await exportElementToPdf(printRef.current, fileName);
      showToast('PDF téléchargé avec succès !');
    } catch { alert('Erreur lors de la génération du PDF.'); } finally { setLoading(false); }
  };

  const handleSendWhatsApp = () => {
    if (!parent) return;
    const phoneClean = parent.phone.replace(/[^0-9+]/g, '');
    const text = type === 'RECEIPT' && payment
      ? `Bonjour ${parent.fullName},\n\nNous vous confirmons la bonne réception de votre versement de ${payment.amount.toLocaleString()} FCFA pour l'élève ${student?.firstName} ${student?.lastName}.\nRéférence : ${payment.reference}\n\nMerci !`
      : `Bonjour ${parent.fullName},\n\nVoici la fiche de suivi de votre enfant ${student?.firstName} ${student?.lastName}.\n\nCordialement, ${settings.directorName}`;
    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`, '_blank');
    showToast('Redirection vers WhatsApp...');
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email) return;
    setEmailForm(prev => ({ ...prev, sent: true }));
    try {
      const subject = type === 'RECEIPT'
        ? `Reçu de versement #${payment?.reference} - ${student?.firstName} ${student?.lastName}`
        : `Fiche de suivi de ${student?.firstName} ${student?.lastName}`;
      const htmlContent = `<div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 12px;"><h2 style="color: #0284c7; margin-top: 0;">${(settings as any).name || 'Centre de Soutien Scolaire'}</h2><p>Bonjour,</p><p>Veuillez trouver ci-joint les informations concernant l'élève <strong>${student?.firstName} ${student?.lastName}</strong>.</p>${type === 'RECEIPT' && payment ? `<div style="background: #ffffff; padding: 12px; border-left: 4px solid #0284c7; margin: 12px 0;"><p><strong>Reçu #${payment.reference}</strong></p><p>Montant réglé : <strong>${payment.amount.toLocaleString()} FCFA</strong></p><p>Date : ${payment.date}</p></div>` : ''}<p style="margin-top: 20px;">Cordialement,<br/><strong>${settings.directorName || 'L\'Administration'}</strong></p></div>`;
      const res = await fetch('/api/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toEmail: emailForm.email, subject, htmlContent }) });
      const data = await res.json();
      showToast(data.success ? 'E-mail envoyé avec succès via Brevo !' : `Note : ${data.error || 'Erreur Brevo'}`);
    } catch { showToast('Document envoyé en simulation.'); } finally { setEmailForm({ show: false, email: '', sent: false }); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200 text-xs">
      <div className="bg-slate-100 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm">{type === 'RECEIPT' ? 'Reçu de Paiement Numérique' : "Fiche d'Information Élève"}</h3>
            <p className="text-[10px] text-slate-400">{type === 'RECEIPT' ? `Aperçu du reçu ${payment?.reference}` : `Aperçu pour ${student.firstName} ${student.lastName}`}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 flex-1 overflow-y-auto">
          <PdfPrintPreview printRef={printRef} type={type} payment={payment} student={student} parent={parent} level={level} studentPayments={studentPayments} studentAssignments={studentAssignments} studentGroups={studentGroups} subjects={subjects} settings={settings} attendanceHistory={attendanceHistory} />
          <PdfActionsSidebar loading={loading} successMsg={successMsg} emailForm={emailForm} setEmailForm={setEmailForm} handleDownloadPDF={handleDownloadPDF} handlePrint={() => window.print()} handleSendWhatsApp={handleSendWhatsApp} handleSendEmail={handleSendEmail} />
        </div>
      </div>
    </div>
  );
};
