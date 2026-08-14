import React, { useState } from 'react';
import { MessageSquare, Mail, Bell, Shield } from 'lucide-react';
import { Preinscription, Level } from '../../../types';
import { AdminNotificationPreview } from './AdminNotificationPreview';

interface NotificationHubProps {
  preinscriptions: Preinscription[];
  levels: Level[];
}

export const AdminNotificationHub: React.FC<NotificationHubProps> = ({ preinscriptions, levels }) => {
  const [activeChannel, setActiveChannel] = useState<'WHATSAPP' | 'EMAIL' | 'PUSH'>('WHATSAPP');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [whatsAppEnabled, setWhatsAppEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const latestPending = preinscriptions.find(p => p.status === 'EN_ATTENTE') || preinscriptions[0] || {
    studentFirstName: 'Moussa',
    studentLastName: 'Diallo',
    parentName: 'Ibrahima Diallo',
    parentPhone: '+221 77 123 45 67',
    levelId: 'lvl-10',
    courseType: 'GROUPE'
  };

  const levelName = levels.find(l => l.id === latestPending.levelId)?.name || 'Classe de 3e';

  const channels = [
    { id: 'WHATSAPP' as const, label: 'WhatsApp', enabled: whatsAppEnabled, set: setWhatsAppEnabled, icon: MessageSquare, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'EMAIL' as const, label: 'E-mail', enabled: emailEnabled, set: setEmailEnabled, icon: Mail, color: 'text-sky-500 bg-sky-50' },
    { id: 'PUSH' as const, label: 'Push Web', enabled: pushEnabled, set: setPushEnabled, icon: Bell, color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
      <div>
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-rose-500" /> Notifications & Canaux
        </h3>
        <p className="text-slate-400 text-[10px] mt-0.5">Configurez le canal de réception des alertes en temps réel.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        {channels.map(ch => {
          const Icon = ch.icon;
          return (
            <button
              key={ch.id} type="button" onClick={() => setActiveChannel(ch.id)}
              className={`p-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeChannel === ch.id ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon className={`w-3.5 h-3.5 ${ch.color}`} />
                <span className="text-[10px]">{ch.label}</span>
              </div>
              <input 
                type="checkbox" checked={ch.enabled} onChange={(e) => { e.stopPropagation(); ch.set(e.target.checked); }}
                className="w-3 h-3 text-sky-500 rounded cursor-pointer mt-0.5"
              />
            </button>
          );
        })}
      </div>

      <AdminNotificationPreview activeChannel={activeChannel} latestPending={latestPending} levelName={levelName} />
    </div>
  );
};
