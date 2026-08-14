import React, { useState, useRef, useEffect } from 'react';
import { User, Phone, MapPin, Search, ChevronDown, CheckCircle2, Mail } from 'lucide-react';
import { THIES_QUARTIERS } from './ThiesQuartiersData';
import { ParentFormErrors } from './enrollmentValidation';
import { ParentPinInputSection } from './ParentPinInputSection';
import { Parent } from '../../../types';
import { arePhonesEqual } from '../../shared/utils/phoneUtils';

interface ParentStepProps {
  parent: { name: string; phone: string; whatsapp: string; address: string; email?: string; pin?: string; confirmPin?: string };
  setParent: (p: any) => void; errors: ParentFormErrors; parents?: Parent[];
}

export const EnrollmentParentStep: React.FC<ParentStepProps> = ({ parent, setParent, errors, parents = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const matchedParent = parents.find(p => arePhonesEqual(p.phone, parent.phone));

  useEffect(() => {
    if (matchedParent) {
      setParent((prev: any) => ({ ...prev, name: prev.name || matchedParent.fullName, address: prev.address || matchedParent.address, email: prev.email || matchedParent.email || '', pin: matchedParent.pin || prev.pin || '1234', confirmPin: matchedParent.pin || prev.confirmPin || '1234' }));
    }
  }, [parent.phone, matchedParent]);

  useEffect(() => {
    const fn = (e: MouseEvent) => containerRef.current && !containerRef.current.contains(e.target as Node) && setIsOpen(false);
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handlePhoneChange = (val: string) => {
    const existing = parents.find(p => arePhonesEqual(p.phone, val));
    if (existing) {
      setParent({ name: existing.fullName, phone: val, whatsapp: val, address: existing.address, email: existing.email || '', pin: existing.pin || '1234', confirmPin: existing.pin || '1234' });
    } else {
      setParent({ ...parent, phone: val, whatsapp: val });
    }
  };

  const filtered = THIES_QUARTIERS.filter(q => q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3 animate-in fade-in text-xs">
      <div className="flex items-center gap-1.5 pb-0.5"><span className="w-1.5 h-3 bg-sky-500 rounded-full" /><h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Informations Parent</h4></div>

      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase">Téléphone (avec WhatsApp)</label>
        <div className="relative flex items-center">
          <Phone className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input type="tel" placeholder="Ex: 77 123 45 67" value={parent.phone} onChange={e => handlePhoneChange(e.target.value)} className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold ${errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'}`} />
        </div>
        {matchedParent && <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Parent reconnu : {matchedParent.fullName}</p>}
        {errors.phone && <p className="text-[10px] font-bold text-red-500">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Nom complet du parent</label>
          <div className="relative flex items-center">
            <User className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input type="text" placeholder="Ex: Elhadji Touré" value={parent.name} onChange={e => setParent({...parent, name: e.target.value})} className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold ${errors.name ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'}`} />
          </div>
          {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Adresse E-mail <span className="font-normal text-slate-400">(Optionnelle)</span></label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input type="email" placeholder="ex: parent@gmail.com" value={parent.email || ''} onChange={e => setParent({...parent, email: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-xs font-medium outline-none" />
          </div>
        </div>
      </div>

      <div className="space-y-1" ref={containerRef}>
        <label className="block text-[10px] font-bold text-slate-400 uppercase">Quartier de Thiès</label>
        <div className="relative">
          <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs flex items-center justify-between font-semibold text-slate-800 cursor-pointer ${errors.address ? 'border-red-500' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" /><span>{parent.address || 'Sélectionner votre quartier'}</span></div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-150 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent text-xs font-semibold outline-none" onClick={e => e.stopPropagation()} />
              </div>
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-50">
                {filtered.map(q => (
                  <button key={q} type="button" onClick={() => { setParent({...parent, address: q}); setIsOpen(false); setSearch(''); }} className="w-full px-3.5 py-2 text-left text-xs font-semibold hover:bg-sky-50 flex items-center justify-between"><span>{q}</span></button>
                ))}
              </div>
            </div>
          )}
        </div>
        {errors.address && <p className="text-[10px] font-bold text-red-500">{errors.address}</p>}
      </div>

      <ParentPinInputSection parent={parent} setParent={setParent} errors={errors} isExistingParent={!!matchedParent} />
    </div>
  );
};
