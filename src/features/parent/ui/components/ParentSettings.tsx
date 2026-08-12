import React, { useState } from 'react';
import { Save, CheckCircle, Bell, Shield, User, Smartphone, MapPin, Server, Mail } from 'lucide-react';
import { Parent } from '../../../../types';
import { ParentSecurityTab } from './ParentSecurityTab';
import { BackendStatusTab } from './BackendStatusTab';

interface ParentSettingsProps { parent: Parent; onSave: (updated: Parent) => void; onUpdatePhone?: (phone: string) => void; }

export function ParentSettings({ parent, onSave, onUpdatePhone }: ParentSettingsProps) {
  const [fullName, setFullName] = useState(parent.fullName);
  const [phone, setPhone] = useState(parent.phone);
  const [address, setAddress] = useState(parent.address || '');
  const [email, setEmail] = useState(parent.email || '');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(parent.emailNotificationsEnabled !== false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'NOTIFS' | 'SECURITY' | 'BACKEND'>('PROFILE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...parent, fullName, phone, address, email, emailNotificationsEnabled: emailAlerts });
    if (onUpdatePhone && phone !== parent.phone) onUpdatePhone(phone);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 max-w-xl mx-auto text-xs">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
        <div><h3 className="font-display font-bold text-slate-800 text-base">Mes Paramètres</h3><p className="text-slate-400 text-[10px]">Gérez vos coordonnées, notifications et sécurité.</p></div>
        <button onClick={handleSubmit} className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"><Save className="w-3.5 h-3.5" /> Enregistrer</button>
      </div>

      {saved && <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl flex items-center gap-2 font-semibold text-[11px]"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Modifications enregistrées !</div>}

      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/50 gap-0.5">
        {[{ id: 'PROFILE', label: 'Profil', icon: User }, { id: 'NOTIFS', label: 'Notifs', icon: Bell }, { id: 'SECURITY', label: 'Sécurité', icon: Shield }, { id: 'BACKEND', label: 'Services DB', icon: Server }].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-xs border' : 'text-slate-500'}`}>
            <tab.icon className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'PROFILE' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="space-y-1"><label className="block text-slate-500 font-bold">Nom complet</label><div className="relative"><User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium" required /></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1"><label className="block text-slate-500 font-bold">Téléphone (WhatsApp)</label><div className="relative"><Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-none" required /></div></div>
            <div className="space-y-1"><label className="block text-slate-500 font-bold">Quartier (Adresse)</label><div className="relative"><MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none" required /></div></div>
          </div>
          <div className="space-y-1"><label className="block text-slate-500 font-bold">Adresse E-mail <span className="font-normal text-slate-400">(Optionnelle)</span></label><div className="relative"><Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="email" placeholder="ex: parent@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none" /></div></div>
        </div>
      )}

      {activeTab === 'NOTIFS' && (
        <div className="space-y-2.5 animate-in fade-in">
          <p className="font-bold text-slate-600">Alertes de Suivi Scolaire</p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center"><div><p className="font-bold text-slate-800">Alertes WhatsApp</p><p className="text-[9px] text-slate-400">Suivi instantané des présences et cours.</p></div><input type="checkbox" checked={whatsappAlerts} onChange={(e) => setWhatsappAlerts(e.target.checked)} className="w-4 h-4 text-sky-500 rounded cursor-pointer" /></div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center"><div><p className="font-bold text-slate-800">Alertes Brevo par E-mail</p><p className="text-[9px] text-slate-400">Recevoir fiches de présence et bilans.</p></div><input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="w-4 h-4 text-sky-500 rounded cursor-pointer" /></div>
        </div>
      )}

      {activeTab === 'SECURITY' && <ParentSecurityTab parent={parent} onSavePin={(newPin) => onSave({ ...parent, pin: newPin })} />}
      {activeTab === 'BACKEND' && <BackendStatusTab />}
    </div>
  );
}


