import { FormEvent } from 'react';
import { UserCheck, Check, Loader2 } from 'lucide-react';

interface ParentProfileModalProps {
  isOpen: boolean; onClose: () => void;
  profileName: string; setProfileName: (val: string) => void;
  profileAddress: string; setProfileAddress: (val: string) => void;
  profilePhone: string; setProfilePhone: (val: string) => void;
  profileWhatsapp: string; setProfileWhatsapp: (val: string) => void;
  isSavingProfile: boolean; profileSuccess: string; onSubmit: (e: FormEvent) => void;
}

export function ParentProfileModal({
  isOpen, onClose, profileName, setProfileName, profileAddress, setProfileAddress,
  profilePhone, setProfilePhone, profileWhatsapp, setProfileWhatsapp, isSavingProfile, profileSuccess, onSubmit
}: ParentProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 z-50 animate-in fade-in duration-200 select-none text-xs overflow-y-auto pt-10 sm:pt-16 pb-12">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5"><UserCheck className="text-sky-500 w-4 h-4" /> Mon Profil Parent</h3>
            <p className="text-slate-400 text-[9px]">Gérez vos coordonnées de contact pour les cours.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer">✕</button>
        </div>

        {profileSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold">
            <Check className="w-3.5 h-3.5 text-emerald-500" /><span>{profileSuccess}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Nom Complet Parent</label>
            <input type="text" required value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2 font-medium text-slate-800 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Adresse de résidence</label>
            <input type="text" required value={profileAddress} onChange={e => setProfileAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2 font-medium text-slate-800 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Téléphone (Login)</label>
              <input type="text" required value={profilePhone} onChange={e => setProfilePhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2 font-bold font-mono text-slate-800 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Numéro WhatsApp</label>
              <input type="text" value={profileWhatsapp} onChange={e => setProfileWhatsapp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2 font-bold font-mono text-slate-800 text-xs" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer text-[10px]">Fermer</button>
            <button type="submit" disabled={isSavingProfile} className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition flex items-center gap-1 cursor-pointer text-[10px] shadow-sm">
              {isSavingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}<span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
