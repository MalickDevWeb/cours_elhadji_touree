import React, { useState } from 'react';
import { Lock, CheckCircle, AlertCircle, MessageCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Parent } from '../../../../types';
import { getWhatsAppLink, generateOtpWhatsAppMsg } from '../../../shared/utils/whatsappHelper';

interface ParentSecurityTabProps { parent: Parent; onSavePin: (newPin: string) => void; }

export const ParentSecurityTab: React.FC<ParentSecurityTabProps> = ({ parent, onSavePin }) => {
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');

  const currentPin = parent.pin || '1234';

  const handleSendWhatsAppOtp = () => {
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(generated); setOtpSent(true); setError('');
    window.open(getWhatsAppLink(parent.whatsapp || parent.phone, generateOtpWhatsAppMsg(parent.fullName, generated)), '_blank');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (otpSent && userOtpInput !== otpCode) return setError('Code WhatsApp incorrect.');
    if (!otpSent && currentPinInput !== currentPin) return setError('Ancien code secret incorrect.');
    if (newPin.length !== 4) return setError('Le code doit comporter 4 chiffres.');
    if (newPin !== confirmPin) return setError('Confirmation de code non conforme.');

    onSavePin(newPin);
    setSuccess('Code secret modifié avec succès !');
    setCurrentPinInput(''); setNewPin(''); setConfirmPin(''); setUserOtpInput(''); setOtpSent(false);
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-150 text-xs">
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-sky-500 shrink-0" />
        <div>
          <p className="font-bold text-slate-800">Changer mon code secret</p>
          <p className="text-[10px] text-slate-500">Modifiez votre code d'accès ou validez via WhatsApp.</p>
        </div>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-2 rounded-xl flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{error}</span></div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-2 rounded-xl flex items-center gap-1.5 font-medium"><CheckCircle className="w-3.5 h-3.5 shrink-0" /><span>{success}</span></div>}

      <form onSubmit={handleUpdatePin} className="space-y-3">
        {!otpSent ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-slate-600 font-bold">Code secret actuel</label>
              <button type="button" onClick={handleSendWhatsAppOtp} className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1"><MessageCircle className="w-3 h-3 text-emerald-500" /> Validation WhatsApp</button>
            </div>
            <input type={showPins ? 'text' : 'password'} maxLength={4} placeholder="Ex: 1234" value={currentPinInput} onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold" required />
          </div>
        ) : (
          <div className="space-y-1 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
            <label className="block text-emerald-800 font-bold">Code de validation WhatsApp (4 chiffres)</label>
            <input type="text" maxLength={4} placeholder="Code reçu" value={userOtpInput} onChange={(e) => setUserOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))} className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl outline-none font-mono font-bold text-center tracking-widest" required />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="block text-slate-600 font-bold">Nouveau code (4 chiffres)</label>
            <input type={showPins ? 'text' : 'password'} maxLength={4} placeholder="Ex: 5678" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold" required />
          </div>
          <div className="space-y-1">
            <label className="block text-slate-600 font-bold">Confirmer nouveau code</label>
            <input type={showPins ? 'text' : 'password'} maxLength={4} placeholder="Ex: 5678" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold" required />
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <button type="button" onClick={() => setShowPins(!showPins)} className="text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 text-[11px]">{showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{showPins ? 'Masquer' : 'Afficher'}</button>
          <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"><Lock className="w-3.5 h-3.5" /> Modifier mon code</button>
        </div>
      </form>
    </div>
  );
};
