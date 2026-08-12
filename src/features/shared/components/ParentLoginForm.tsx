import React, { useState } from 'react';
import { LogIn, Phone, Lock, Eye, EyeOff, MessageCircle, ShieldCheck } from 'lucide-react';
import { Parent } from '../../../types';
import { mockDb } from '../infrastructure/mockDb';
import { getWhatsAppLink } from '../utils/whatsappHelper';
import { arePhonesEqual } from '../utils/phoneUtils';

interface ParentLoginFormProps {
  parents: Parent[]; onSuccess: (phone: string) => void; onError: (msg: string) => void;
}

export function ParentLoginForm({ parents, onSuccess, onError }: ParentLoginFormProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = parents.find(p => arePhonesEqual(p.phone, phone));

    if (found) {
      if (password === (found.pin || '1234')) {
        onError(''); onSuccess(found.phone);
      } else {
        onError('Code secret incorrect. Cliquez sur "Oublié ?" pour réinitialiser via WhatsApp.');
      }
    } else {
      const pending = mockDb.getPreinscriptions().find(p => arePhonesEqual(p.parentPhone, phone) && p.status === 'EN_ATTENTE');
      if (pending) {
        onError('Votre pré-inscription est en attente. Vos identifiants vous seront envoyés sans frais par WhatsApp dès validation.');
      } else {
        onError('Aucun compte parent trouvé avec ce numéro.');
      }
    }
  };

  const handleForgotPin = () => {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      onError('Veuillez d\'abord saisir votre numéro de téléphone.');
      return;
    }
    onError('');
    const msg = `Bonjour Administration, j'ai oublié mon code secret Espace Parent pour le numéro : ${trimmedPhone}. Merci de me le réenvoyer sur WhatsApp.`;
    window.open(getWhatsAppLink('771719013', msg), '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
      <div className="space-y-1">
        <label className="block text-slate-600 font-semibold text-xs">Numéro de téléphone Parent</label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input id="parent-popup-phone" type="text" placeholder="+221 77 123 45 67" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition bg-slate-50/60 text-xs font-medium text-slate-800" required />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <label className="block text-slate-600 font-semibold">Code secret (4 chiffres)</label>
          <button type="button" onClick={handleForgotPin} className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 transition">
            <MessageCircle className="w-3 h-3 text-emerald-500" /> Oublié ?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input id="parent-popup-password" type={showPassword ? 'text' : 'password'} maxLength={4} placeholder="Ex: 1234" value={password} onChange={e => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))} className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition bg-slate-50/60 font-mono font-bold text-slate-800 text-xs tracking-wider" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button type="submit" id="parent-popup-submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-sm hover:shadow-md cursor-pointer">
        <LogIn className="w-4 h-4" /> Se connecter (Espace Parent)
      </button>

      <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-200/80 space-y-1 text-slate-500 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Parents démo (Test direct)</span>
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
        </div>
        <div className="space-y-1">
          {parents.map(p => (
            <button key={p.id} type="button" onClick={() => { setPhone(p.phone); setPassword(p.pin || '1234'); }} className="w-full text-left p-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 transition flex justify-between items-center text-[10px] text-slate-600 font-medium cursor-pointer">
              <span className="font-semibold text-slate-800">{p.fullName}</span>
              <span className="font-mono text-slate-400">{p.phone}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
