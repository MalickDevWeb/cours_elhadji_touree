import React, { useState } from 'react';
import { User, Shield, Check, Loader2, Calendar, BookOpen } from 'lucide-react';
import { Teacher } from '../../../types';

interface TeacherSettingsProps { teacher: Teacher; onUpdateTeacher: (updated: Teacher) => void; }

export function TeacherSettings({ teacher, onUpdateTeacher }: TeacherSettingsProps) {
  const [activeTab, setActiveTab] = useState<'PROFIL' | 'DISPO' | 'SECURE'>('PROFIL');
  const [phone, setPhone] = useState(teacher.phone);
  const [address, setAddress] = useState(teacher.address);
  const [availabilities, setAvailabilities] = useState(teacher.availabilities);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    setTimeout(() => {
      onUpdateTeacher({ ...teacher, phone, address, availabilities });
      setIsSaving(false); setSuccess(true); setTimeout(() => setSuccess(false), 2000);
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-800 tracking-tight">Paramètres du compte</h1>
          <p className="text-slate-500 text-xs">Gérez vos informations de profil, vos disponibilités et la sécurité.</p>
        </div>

        <div className="flex border-b border-slate-200 gap-6">
          {(['PROFIL', 'DISPO', 'SECURE'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${activeTab === t ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'}`}>
              <span className="flex items-center gap-1.5">
                {t === 'PROFIL' && <><User className="w-4 h-4" /> Profil</>}
                {t === 'DISPO' && <><Calendar className="w-4 h-4" /> Disponibilités</>}
                {t === 'SECURE' && <><Shield className="w-4 h-4" /> Sécurité</>}
              </span>
              {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>
          ))}
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 font-bold animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-500" /><span>Vos modifications ont été enregistrées avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6">
          {activeTab === 'PROFIL' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1"><label className="block font-bold text-slate-700">Nom Complet</label><input type="text" disabled value={teacher.fullName} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-500 cursor-not-allowed" /></div>
                <div className="space-y-1"><label className="block font-bold text-slate-700">Spécialité</label><input type="text" disabled value="Enseignant Titulaire" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-500 cursor-not-allowed" /></div>
              </div>
              <div className="space-y-1"><label className="block font-bold text-slate-700">Adresse de résidence</label><input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-2.5 transition outline-none text-slate-800" /></div>
              <div className="space-y-1"><label className="block font-bold text-slate-700">Téléphone (Identifiant)</label><input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-2.5 transition outline-none font-bold text-slate-800 font-mono" /></div>
            </div>
          )}

          {activeTab === 'DISPO' && (
            <div className="space-y-4">
              <div className="space-y-1"><label className="block font-bold text-slate-700">Vos créneaux de disponibilité</label><input type="text" required value={availabilities} onChange={e => setAvailabilities(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-2.5 transition outline-none text-slate-800 font-bold" /></div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-155 space-y-2">
                <h4 className="font-bold text-slate-700 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-amber-500" /> Matières enseignées</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-xl font-bold">Mathématiques</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-xl font-bold">Sciences Physiques</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURE' && (
            <div className="space-y-4">
              <div className="space-y-1"><label className="block font-bold text-slate-700">Nouveau mot de passe</label><input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-2.5 transition outline-none" /></div>
              <div className="space-y-1"><label className="block font-bold text-slate-700">Confirmer le mot de passe</label><input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-2.5 transition outline-none" /></div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" disabled={isSaving} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-white font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Enregistrer les modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
