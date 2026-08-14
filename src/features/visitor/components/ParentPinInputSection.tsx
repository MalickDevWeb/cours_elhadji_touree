import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { ParentFormErrors } from './enrollmentValidation';

interface PinProps {
  parent: { pin?: string; confirmPin?: string };
  setParent: (p: any) => void;
  errors: ParentFormErrors;
  isExistingParent?: boolean;
}

export const ParentPinInputSection: React.FC<PinProps> = ({ parent, setParent, errors, isExistingParent }) => {
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  if (isExistingParent) {
    return (
      <div className="pt-2 border-t border-slate-100 bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs animate-in fade-in">
        <div className="p-1.5 bg-emerald-500 text-white rounded-lg shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <h5 className="font-bold text-slate-900 text-xs">Compte Parent Existant Reconnu</h5>
          <p className="text-[10px] text-slate-600 font-medium">Votre code secret PIN actuel est conservé. Cet enfant sera ajouté à votre espace parent.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-slate-100 bg-amber-50/50 border border-amber-200/60 p-3 rounded-2xl space-y-2.5">
      <div className="flex items-center gap-1.5">
        <div className="p-1 bg-amber-500 text-white rounded-lg"><Lock className="w-3.5 h-3.5" /></div>
        <div>
          <h5 className="font-bold text-slate-900 text-xs">Créer votre Code Secret (4 chiffres)</h5>
          <p className="text-[10px] text-slate-500 font-medium">Nécessaire pour vos futures connexions avec votre numéro.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Code (4 chiffres)</label>
          <div className="relative flex items-center">
            <input type={showPin ? "text" : "password"} maxLength={4} placeholder="Ex: 1234" value={parent.pin || ''} onChange={e => setParent((p: any) => ({ ...p, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))} className={`w-full pl-3 pr-8 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-slate-800 outline-none ${errors.pin ? 'border-red-500' : 'border-amber-300 focus:border-amber-500'}`} />
            <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer">
              {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.pin && <p className="text-[9px] font-bold text-red-500">{errors.pin}</p>}
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Confirmer le code</label>
          <div className="relative flex items-center">
            <input type={showConfirmPin ? "text" : "password"} maxLength={4} placeholder="Confirmer" value={parent.confirmPin || ''} onChange={e => setParent((p: any) => ({ ...p, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 4) }))} className={`w-full pl-3 pr-8 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-slate-800 outline-none ${errors.confirmPin ? 'border-red-500' : 'border-amber-300 focus:border-amber-500'}`} />
            <button type="button" onClick={() => setShowConfirmPin(!showConfirmPin)} className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer">
              {showConfirmPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.confirmPin && <p className="text-[9px] font-bold text-red-500">{errors.confirmPin}</p>}
        </div>
      </div>
    </div>
  );
};
