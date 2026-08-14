import React from 'react';
import { Layers, Plus, Trash2, BookOpen, School, GraduationCap, BookMarked } from 'lucide-react';
import { Settings, SchoolCycle } from '../../../types';
import { defaultSchoolCycles } from '../../shared/infrastructure/mockDbData';

interface Props { form: Settings; onChange: (updated: Settings) => void; }

const renderCycleIcon = (name: string, code?: string) => {
  const lower = (name + ' ' + (code || '')).toLowerCase();
  if (lower.includes('prim')) return <BookOpen className="w-4 h-4 shrink-0 text-sky-600" />;
  if (lower.includes('cem') || lower.includes('coll')) return <School className="w-4 h-4 shrink-0 text-amber-600" />;
  if (lower.includes('lyc')) return <GraduationCap className="w-4 h-4 shrink-0 text-emerald-600" />;
  return <BookMarked className="w-4 h-4 shrink-0 text-sky-600" />;
};

export const SettingsCyclesTab: React.FC<Props> = ({ form, onChange }) => {
  const cycles = form.cycles || defaultSchoolCycles;

  const handleUpdateCycle = (id: string, field: keyof SchoolCycle, value: any) => {
    onChange({ ...form, cycles: cycles.map(c => c.id === id ? { ...c, [field]: value } : c) });
  };

  const handleAddCycle = () => {
    const newCycle: SchoolCycle = {
      id: `cyc-${Date.now()}`, name: 'Nouveau Cycle', code: 'AUTRE',
      levels: ['Niveau 1'], registrationFee: 5000, monthlyFee: 5000, icon: '🎓'
    };
    onChange({ ...form, cycles: [...cycles, newCycle] });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 text-xs">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <div>
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-500" /> Cycles Scolaires & Tarification
          </h4>
          <p className="text-slate-400 text-[10px]">Frais d'inscription et mensualités par cycle (Primaire, Collège CEM, Lycée).</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onChange({ ...form, cycles: defaultSchoolCycles })} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200 cursor-pointer">
            Réinitialiser
          </button>
          <button type="button" onClick={handleAddCycle} className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-slate-800 cursor-pointer">
            <Plus className="w-3 h-3" /> Ajouter Cycle
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {cycles.map(cyc => (
          <div key={cyc.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                {renderCycleIcon(cyc.name, cyc.code)}
                <input type="text" value={cyc.name} onChange={e => handleUpdateCycle(cyc.id, 'name', e.target.value)} className="font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs flex-1 outline-none focus:border-amber-400" />
              </div>
              <button type="button" onClick={() => onChange({ ...form, cycles: cycles.filter(c => c.id !== cyc.id) })} className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Frais d'inscription (FCFA)</label>
                <input type="number" value={cyc.registrationFee} onChange={e => handleUpdateCycle(cyc.id, 'registrationFee', Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 text-xs" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Mensualité (FCFA/mois)</label>
                <input type="number" value={cyc.monthlyFee} onChange={e => handleUpdateCycle(cyc.id, 'monthlyFee', Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Niveaux associés</label>
              <input type="text" value={cyc.levels.join(', ')} onChange={e => handleUpdateCycle(cyc.id, 'levels', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-600 text-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
