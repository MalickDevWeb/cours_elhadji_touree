import React from 'react';
import { Payment, Student, Parent, Level, Settings } from '../../../types';
import { CheckCircle2, ShieldCheck, Receipt as ReceiptIcon, Award } from 'lucide-react';

interface ReceiptPdfSheetProps {
  payment: Payment; student: Student; parent?: Parent;
  level?: Level; settings: Settings; attendanceRecords?: any[];
}

export const ReceiptPdfSheet: React.FC<ReceiptPdfSheetProps> = ({ payment, student, parent, level }) => {
  const methodLabel = payment.method === 'ESPECES' ? 'Espèces / Caisse' : payment.method === 'WAVE' ? 'Wave Mobile' : 'Orange Money';

  return (
    <div className="space-y-4 text-slate-800 font-sans">
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-sky-800/40">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-black uppercase tracking-wider font-display text-sky-100">Reçu de Paiement Officiel</h2>
          </div>
          <p className="text-[10px] text-sky-300/80 font-mono">N° Référence : <strong className="text-white">{payment.reference}</strong></p>
        </div>
        <div className="text-right space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[9.5px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> REÇU VALIDÉ
          </span>
          <p className="text-[9px] text-slate-300">Date : {payment.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[8.5px] font-bold text-sky-600 uppercase tracking-widest block">Élève concerné</span>
          <p className="font-black text-slate-900 text-sm">{student.firstName} {student.lastName}</p>
          <p className="text-[10.5px] text-slate-500 font-medium">Classe : <span className="font-bold text-slate-800">{level?.name || 'Inconnue'}</span></p>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[8.5px] font-bold text-sky-600 uppercase tracking-widest block">Parent / Témoin de règlement</span>
          <p className="font-black text-slate-900 text-sm">{parent?.fullName || 'N/A'}</p>
          <p className="text-[10.5px] text-slate-500 font-medium">Téléphone : <span className="font-bold text-slate-800">{parent?.phone || 'N/A'}</span></p>
        </div>
      </div>

      <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
        <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-[9.5px] uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-sky-600" /> Détails de la transaction
          </span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Règlement Effectif</span>
        </div>
        <div className="p-3.5 space-y-2.5">
          <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Objet / Motif</span>
            <span className="font-bold text-slate-900">Frais de Scolarité & Cours de Soutien</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Mode de versement</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">{methodLabel}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Certification de Caisse</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1 text-[10px]"><ShieldCheck className="w-3.5 h-3.5" /> Encaissé et Archivé</span>
          </div>
        </div>

        <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between">
          <div>
            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block">Montant Total Réglé</span>
            <span className="text-[9.5px] text-emerald-400 font-semibold">Francs CFA (XOF)</span>
          </div>
          <span className="text-lg font-black font-display text-emerald-400">{payment.amount.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      <p className="text-[9px] text-slate-400 italic text-center">* Ce document numérique fait foi de paiement. Les frais versés ne sont ni remboursables ni transférables.</p>
    </div>
  );
};
