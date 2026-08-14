import React, { useState } from 'react';
import { CreditCard, ExternalLink, Copy, Check, Upload, X, CheckCircle2, PhoneCall } from 'lucide-react';
import { Student, Settings } from '../../../../types';

interface PaymentStepFormProps {
  student: Student; amount: number; paymentMethod: 'WAVE' | 'ORANGE_MONEY';
  setPaymentMethod: (m: 'WAVE' | 'ORANGE_MONEY') => void;
  paymentPhoneNumber: string; setPaymentPhoneNumber: (val: string) => void;
  proofUrl?: string; setProofUrl?: (val: string) => void;
  transactionNote?: string; setTransactionNote?: (val: string) => void;
  settings?: Settings; onExecute: () => void;
}

export function PaymentStepForm({
  student, amount, paymentMethod, setPaymentMethod, proofUrl = '', setProofUrl, settings, onExecute
}: PaymentStepFormProps) {
  const [copied, setCopied] = useState(false);
  const rawPhone = (settings?.phone || '77 644 12 12').replace(/\D/g, '');
  const cleanPhone = rawPhone.length === 9 ? rawPhone : '776441212';
  const waveUrl = `https://wave.com/send?phone=221${cleanPhone}&amount=${amount}`;
  const ussdCode = `#144#1*1*${cleanPhone}*${amount}#`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setProofUrl) {
      const r = new FileReader(); r.onloadend = () => setProofUrl(r.result as string); r.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2.5 text-xs">
      <div className="bg-slate-50 p-2.5 rounded-xl flex justify-between items-center border border-slate-200">
        <div><span className="text-[9px] uppercase font-bold text-slate-400 block">Élève</span><span className="font-bold text-slate-800 text-xs">{student.firstName} {student.lastName}</span></div>
        <div className="text-right"><span className="text-[9px] uppercase font-bold text-slate-400 block">Montant</span><span className="font-mono font-black text-emerald-600 text-xs">{amount.toLocaleString('fr-FR')} FCFA</span></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setPaymentMethod('WAVE')} className={`p-2 rounded-xl border font-bold transition cursor-pointer text-center ${paymentMethod === 'WAVE' ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-2xs' : 'bg-white border-slate-200 text-slate-500'}`}>🌊 Wave</button>
        <button type="button" onClick={() => setPaymentMethod('ORANGE_MONEY')} className={`p-2 rounded-xl border font-bold transition cursor-pointer text-center ${paymentMethod === 'ORANGE_MONEY' ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-2xs' : 'bg-white border-slate-200 text-slate-500'}`}>🍊 Orange Money (Maxit)</button>
      </div>

      {paymentMethod === 'WAVE' ? (
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 space-y-1.5">
          <a href={waveUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-3 rounded-lg transition flex items-center justify-center gap-2 text-xs shadow-xs">
            <ExternalLink className="w-4 h-4" /> 1. Ouvrir l&apos;application Wave ({amount} FCFA)
          </a>
          <p className="text-[9.5px] text-sky-800 text-center font-medium">✨ Lien direct avec numéro et montant pré-remplis !</p>
        </div>
      ) : (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
            <span>1. Code USSD pré-rempli (Orange Money) :</span>
            <button type="button" onClick={() => copyToClipboard(ussdCode)} className="px-2 py-0.5 bg-white border border-amber-300 rounded text-amber-800 flex items-center gap-1 cursor-pointer text-[10px]">
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
          <div className="bg-white border border-amber-200 rounded-lg p-1.5 font-mono font-bold text-center text-amber-900 text-xs tracking-wide select-all">{ussdCode}</div>
          <div className="flex gap-2 text-[10px]">
            <a href={`tel:${encodeURIComponent(ussdCode)}`} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 rounded-lg flex items-center justify-center gap-1">
              <PhoneCall className="w-3 h-3" /> Composer direct sur téléphone
            </a>
            <button type="button" onClick={() => copyToClipboard(cleanPhone)} className="px-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg border border-amber-300">
              Copier num ({cleanPhone})
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 text-[10.5px] mb-1">2. Joindre la capture d&apos;écran du reçu de paiement</label>
        <label className={`border-2 border-dashed rounded-xl p-2 flex items-center justify-center gap-2 cursor-pointer transition text-[11px] ${proofUrl ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 text-slate-600'}`}>
          {proofUrl ? (
            <><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Preuve importée avec succès ✓</span></>
          ) : (
            <><Upload className="w-4 h-4 text-sky-500" /><span className="font-bold">Cliquez pour importer la capture du reçu</span></>
          )}
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {proofUrl && (
        <div className="relative w-full h-16 bg-emerald-50 rounded-xl overflow-hidden border border-emerald-200 p-1 flex items-center justify-center">
          <img src={proofUrl} alt="Capture preuve" className="h-full object-contain" />
          <button type="button" onClick={() => setProofUrl?.('')} title="Supprimer la capture" className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <button onClick={onExecute} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs shadow-xs">
        <CreditCard className="w-4 h-4" /> 3. Valider l&apos;envoi du paiement
      </button>
    </div>
  );
}
