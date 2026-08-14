import React from 'react';
import { Payment, Student } from '../../../types';
import { CheckCircle2, XCircle, FileText, ImageIcon, X } from 'lucide-react';

interface PaymentProofModalProps {
  payment: Payment;
  student?: Student;
  onValidate: (id: string, status: 'VALIDE' | 'REFUSE') => void;
  onClose: () => void;
}

export function PaymentProofModal({ payment, student, onValidate, onClose }: PaymentProofModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-5 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-slate-800">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-500" /> Preuve de Paiement Mobile
            </h3>
            <p className="text-slate-400 text-[10px]">Réf: {payment.reference} - {payment.date}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl grid grid-cols-2 gap-2 border border-slate-100">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Élève</span>
            <span className="font-bold text-slate-800">{student ? `${student.firstName} ${student.lastName}` : 'Inconnu'}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Montant</span>
            <span className="font-mono font-black text-emerald-600 text-xs">{payment.amount.toLocaleString()} FCFA</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Moyen</span>
            <span className="font-bold text-sky-700">{payment.method}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Statut</span>
            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${payment.status === 'VALIDE' ? 'bg-emerald-100 text-emerald-800' : payment.status === 'REFUSE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
              {payment.status === 'VALIDE' ? '✓ Validé' : payment.status === 'REFUSE' ? '✕ Refusé' : '⏳ En attente'}
            </span>
          </div>
        </div>

        {payment.transactionNote && (
          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-3 space-y-1">
            <span className="text-[10px] font-bold text-sky-900 block">Note / SMS de Transaction :</span>
            <p className="text-sky-800 font-mono text-[11px] font-semibold break-words">{payment.transactionNote}</p>
          </div>
        )}

        {payment.proofUrl ? (
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-sky-500" /> Capture d'écran jointe par le parent :
            </span>
            <div className="max-h-64 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-2 border">
              <img src={payment.proofUrl} alt="Capture preuve paiement Wave" className="max-h-60 max-w-full object-contain rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-dashed rounded-2xl text-center text-slate-400 text-[11px]">
            Aucune capture d'écran jointe pour ce transfert.
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button onClick={() => { onValidate(payment.id, 'VALIDE'); onClose(); }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
            <CheckCircle2 className="w-4 h-4" /> Valider le paiement
          </button>
          <button onClick={() => { onValidate(payment.id, 'REFUSE'); onClose(); }} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
            <XCircle className="w-4 h-4" /> Refuser le paiement
          </button>
        </div>
      </div>
    </div>
  );
}
