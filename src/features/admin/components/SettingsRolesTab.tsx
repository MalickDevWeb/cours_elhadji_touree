import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckSquare, Square, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const MODULES = [
  { id: 'finances', name: 'Suivi des Finances (Encaissements, Impayés)' },
  { id: 'notes', name: 'Relevés de Notes & Bulletins' },
  { id: 'emargements', name: 'Émargements & Présences' },
  { id: 'whatsapp', name: 'Messagerie & Rappels WhatsApp' },
  { id: 'site', name: 'Configuration générale & Tarifs' },
];

const ROLES = [
  { name: 'Administrateur', desc: 'Contrôle complet (Finances, Utilisateurs, Cours, Paramètres)' },
  { name: 'Enseignant', desc: 'Gestion de ses cours, relevés de notes et émargements' },
  { name: 'Parent', desc: 'Suivi de ses enfants, paiements, fiches PDF' },
];

export const SettingsRolesTab: React.FC = () => {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, { level: string; modules: Record<string, boolean> }>>(() => {
    const saved = localStorage.getItem('soutien_roles_permissions');
    return saved ? JSON.parse(saved) : {
      'Administrateur': { level: 'Lecture/Écriture', modules: { finances: true, notes: true, emargements: true, whatsapp: true, site: true } },
      'Enseignant': { level: 'Limité', modules: { finances: false, notes: true, emargements: true, whatsapp: false, site: false } },
      'Parent': { level: 'Limité', modules: { finances: false, notes: false, emargements: false, whatsapp: true, site: false } }
    };
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('soutien_roles_permissions', JSON.stringify(permissions));
  }, [permissions]);

  const updatePerm = (role: string, updateFn: (conf: any) => any) => {
    setPermissions(prev => {
      const updated = { ...prev, [role]: updateFn(prev[role] || { level: 'Limité', modules: {} }) };
      setToast('Permissions modifiées');
      setTimeout(() => setToast(null), 1500);
      return updated;
    });
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-150 relative">
      <div className="flex justify-between items-center text-[10px]">
        <span className="font-bold text-slate-600">Permissions et droits d'accès :</span>
        {toast && (
          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100 animate-pulse">
            <CheckCircle className="w-3 h-3 inline mr-1" /> {toast}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {ROLES.map((r) => {
          const config = permissions[r.name] || { level: 'Limité', modules: {} };
          const isExpanded = activeRole === r.name;

          return (
            <div key={r.name} className="border border-slate-200/60 rounded-xl overflow-hidden bg-white shadow-3xs">
              <button type="button" onClick={() => setActiveRole(isExpanded ? null : r.name)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/70 flex justify-between items-center text-xs gap-3 text-left transition cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> {r.name}</p>
                  <p className="text-[9px] text-slate-400 leading-normal">{r.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 px-2 py-1 rounded bg-sky-50 text-sky-600 font-bold text-[9px] border border-sky-100">{config.level}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 bg-white border-t border-slate-100 space-y-3 text-[10px]">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-500 uppercase">Niveau d'autorisation global</label>
                    <select value={config.level} onChange={(e) => updatePerm(r.name, c => ({ ...c, level: e.target.value }))} className="p-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none">
                      <option value="Lecture/Écriture">Lecture/Écriture</option>
                      <option value="Limité">Limité</option>
                      <option value="Lecture Seule">Lecture Seule</option>
                      <option value="Désactivé">Désactivé</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100/50">
                    <p className="font-bold text-slate-500 uppercase mb-1">Modules Activés</p>
                    {MODULES.map((m) => {
                      const isEnabled = !!config.modules?.[m.id];
                      return (
                        <button key={m.id} type="button" onClick={() => updatePerm(r.name, c => ({ ...c, modules: { ...c.modules, [m.id]: !isEnabled } }))} className="w-full flex items-center gap-2 text-left py-0.5 font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer">
                          {isEnabled ? <CheckSquare className="w-3.5 h-3.5 text-sky-600 shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                          <span>{m.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
