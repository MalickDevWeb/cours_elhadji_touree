import React from 'react';
import { CreditCard, Loader2, CheckCircle, Wallet } from 'lucide-react';
import { Student, Payment, Settings } from '../../../../types';
import { PaymentStepForm } from './PaymentStepForm';
import { PaymentHistoryList } from './PaymentHistoryList';
import { getChildPaymentSummary } from '../../domain/parentCalculations';

interface ParentPaymentPageProps {
  myChildren: Student[]; payments: Payment[]; selectedStudentId: string | null;
  onSelectStudent: (id: string) => void; paymentMethod: 'WAVE' | 'ORANGE_MONEY';
  setPaymentMethod: (m: 'WAVE' | 'ORANGE_MONEY') => void; paymentPhoneNumber: string;
  setPaymentPhoneNumber: (v: string) => void; proofUrl?: string; setProofUrl?: (v: string) => void;
  transactionNote?: string; setTransactionNote?: (v: string) => void;
  paymentStep: 1 | 2 | 3; setPaymentStep: (s: 1 | 2 | 3) => void; settings?: Settings;
  onExecute: (studentId: string, amount: number) => void;
  onViewReceiptPdf?: (paymentId: string) => void;
}

export function ParentPaymentPage({
  myChildren, payments, selectedStudentId, onSelectStudent, paymentMethod, setPaymentMethod,
  paymentPhoneNumber, setPaymentPhoneNumber, proofUrl, setProofUrl, transactionNote, setTransactionNote,
  paymentStep, setPaymentStep, settings, onExecute, onViewReceiptPdf
}: ParentPaymentPageProps) {
  const activeStudent = myChildren.find(c => c.id === selectedStudentId) || myChildren[0];
  const summary = activeStudent ? getChildPaymentSummary(activeStudent.id, payments) : null;
  const payAmount = summary ? (summary.remains > 0 ? summary.remains : summary.monthly) : 0;

  if (!activeStudent || !summary) {
    return <div className="p-8 text-center text-slate-500 font-bold">Aucun enfant associé à votre compte.</div>;
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto text-xs animate-in fade-in duration-200">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-1">
        <h2 className="font-display font-black text-slate-800 text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" /> Page de Règlement Scolarité
        </h2>
        <p className="text-slate-500 text-[11px]">Effectuez vos versements et consultez l&apos;historique de vos reçus.</p>
      </div>

      {myChildren.length > 1 && (
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sélectionnez l&apos;enfant à régler :</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {myChildren.map(child => {
              const fin = getChildPaymentSummary(child.id, payments);
              const isSelected = child.id === activeStudent.id;
              const badgeStyle = isSelected
                ? (fin.remains > 0 ? 'bg-red-500/20 text-red-200 border-red-400/30' : fin.pendingSum > 0 ? 'bg-amber-400/20 text-amber-200 border-amber-300/30' : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30')
                : (fin.remains > 0 ? 'bg-red-50 text-red-700 border-red-200/80' : fin.pendingSum > 0 ? 'bg-amber-50 text-amber-700 border-amber-200/80' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80');
              const badgeText = fin.remains > 0 ? `Reste: ${fin.remains.toLocaleString('fr-FR')} F` : (fin.pendingSum > 0 ? 'En attente' : 'À jour');
              return (
                <button key={child.id} type="button" onClick={() => { onSelectStudent(child.id); setPaymentStep(1); }} className={`p-3 rounded-xl text-xs transition flex items-center justify-between cursor-pointer border ${isSelected ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-900/10' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'}`}>
                  <span className="font-bold">{child.firstName}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${badgeStyle}`}>{badgeText}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
        {paymentStep === 1 && (
          <PaymentStepForm student={activeStudent} amount={payAmount} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} paymentPhoneNumber={paymentPhoneNumber} setPaymentPhoneNumber={setPaymentPhoneNumber} proofUrl={proofUrl} setProofUrl={setProofUrl} transactionNote={transactionNote} setTransactionNote={setTransactionNote} settings={settings} onExecute={() => onExecute(activeStudent.id, payAmount)} />
        )}

        {paymentStep === 2 && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Paiement en cours de traitement...</h4>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">Transfert pour <strong className="text-slate-800">{activeStudent.firstName} ({payAmount.toLocaleString('fr-FR')} FCFA)</strong>.</p>
          </div>
        )}

        {paymentStep === 3 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm"><CheckCircle className="w-8 h-8 shrink-0" /></div>
            <h4 className="font-display font-black text-slate-800 text-base">Preuve de paiement envoyée avec succès !</h4>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">Le règlement pour {activeStudent.firstName} ({payAmount.toLocaleString('fr-FR')} FCFA) a bien été transmis à l&apos;administration pour validation.</p>
            <button onClick={() => setPaymentStep(1)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-2 mx-auto">
              <Wallet className="w-4 h-4" /> Effectuer un autre virement
            </button>
          </div>
        )}
      </div>

      <PaymentHistoryList payments={payments} students={myChildren} activeStudentId={activeStudent.id} onViewReceiptPdf={onViewReceiptPdf} />
    </div>
  );
}

