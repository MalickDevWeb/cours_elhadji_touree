import React from 'react';
import { Smartphone, Mail, Bell, Check } from 'lucide-react';

interface PreviewProps {
  activeChannel: 'WHATSAPP' | 'EMAIL' | 'PUSH';
  latestPending: any;
  levelName: string;
}

export const AdminNotificationPreview: React.FC<PreviewProps> = ({ activeChannel, latestPending, levelName }) => {
  return (
    <div className="bg-slate-950 text-white p-4 rounded-2xl relative min-h-[130px] flex flex-col justify-between font-mono text-[10px] border border-slate-800">
      {activeChannel === 'WHATSAPP' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-emerald-400">
            <Smartphone className="w-3.5 h-3.5" /> <span>Simulation Alerte WhatsApp (Directeur)</span>
            <span className="ml-auto text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-sans uppercase">Actif</span>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-900/50 p-2.5 rounded-xl space-y-1.5 text-[9px] text-slate-200 leading-relaxed font-sans">
            <span className="font-bold text-emerald-400 block">De : SunuSoutien Bot (WhatsApp API)</span>
            <p>
              "Bonjour Directeur ! Nouvelle pré-inscription reçue :<br/>
              Élève : <strong className="text-white">{latestPending.studentFirstName} {latestPending.studentLastName}</strong> ({levelName})<br/>
              Parent : {latestPending.parentName} ({latestPending.parentPhone})<br/>
              Format : {latestPending.courseType}"
            </p>
          </div>
        </div>
      )}

      {activeChannel === 'EMAIL' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-sky-400">
            <Mail className="w-3.5 h-3.5" /> <span>Notification E-mail (ecole22101@gmail.com)</span>
            <span className="ml-auto text-[8px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-sans uppercase">Actif</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-1.5 text-[9px] text-slate-200 leading-relaxed font-sans">
            <span className="font-bold text-sky-400 block">Sujet : [SunuSoutien] Action requise : Nouvelle inscription en attente</span>
            <p className="border-t border-slate-800 pt-1">
              Cher Administrateur, une demande en attente nécessite votre validation.<br/>
              <button type="button" className="mt-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-2.5 py-1 rounded text-[8px] inline-flex items-center gap-1 cursor-pointer">
                <Check className="w-2.5 h-2.5" /> Approuver le dossier
              </button>
            </p>
          </div>
        </div>
      )}

      {activeChannel === 'PUSH' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-amber-400">
            <Bell className="w-3.5 h-3.5" /> <span>Notification Push Browser</span>
            <span className="ml-auto text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-sans uppercase">Actif</span>
          </div>
          <div className="bg-amber-950/25 border border-amber-900/50 p-2.5 rounded-xl space-y-1 text-[9px] text-slate-200 font-sans">
            <div className="flex items-center justify-between font-bold text-amber-400">
              <span>SunuSoutien Direct</span>
              <span className="text-[7px] text-slate-500">À l'instant</span>
            </div>
            <p className="font-bold text-[10px] text-white">Demande d'inscription reçue !</p>
            <p className="text-slate-400 text-[9px]">{latestPending.studentFirstName} {latestPending.studentLastName} ({levelName}) attend votre validation.</p>
          </div>
        </div>
      )}

      <div className="text-[8px] text-slate-500 text-right pt-2 border-t border-slate-900 font-sans">
        * Les e-mails réels personnalisés sont envoyés en direct via l'API Brevo.
      </div>
    </div>
  );
};
