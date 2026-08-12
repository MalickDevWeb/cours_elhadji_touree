import React from 'react';
import { Settings } from '../../../types';
import { LogoCloudinaryUploader } from './LogoCloudinaryUploader';

interface CenterTabProps {
  form: Settings;
  onChange: (updated: Settings) => void;
}

export const SettingsCenterTab: React.FC<CenterTabProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-3 animate-in fade-in duration-150 text-xs">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-500 font-bold mb-1">Nom du centre / École</label>
          <input 
            type="text" 
            value={form.centerName} 
            onChange={e => onChange({...form, centerName: e.target.value})} 
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500" 
            required 
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Nom du directeur</label>
          <input 
            type="text" 
            value={form.directorName} 
            onChange={e => onChange({...form, directorName: e.target.value})} 
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500" 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-500 font-bold mb-1">Téléphone</label>
          <input 
            type="text" 
            value={form.phone} 
            onChange={e => onChange({...form, phone: e.target.value})} 
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500" 
            required 
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">WhatsApp</label>
          <input 
            type="text" 
            value={form.whatsapp} 
            onChange={e => onChange({...form, whatsapp: e.target.value})} 
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500" 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-500 font-bold mb-1">Email Officiel</label>
          <input 
            type="email" 
            value={form.email || ''} 
            onChange={e => onChange({...form, email: e.target.value})} 
            placeholder="contact@ecole.sn"
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500" 
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Adresse / Ville</label>
          <input 
            type="text" 
            value={form.address || ''} 
            onChange={e => onChange({...form, address: e.target.value})} 
            placeholder="Almadies, Dakar"
            className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500" 
          />
        </div>
      </div>

      <LogoCloudinaryUploader
        logoUrl={form.logoUrl}
        onLogoChange={(url) => onChange({ ...form, logoUrl: url })}
      />

      <div>
        <label className="block text-slate-500 font-bold mb-1">Présentation générale</label>
        <textarea 
          rows={2} 
          value={form.aboutText} 
          onChange={e => onChange({...form, aboutText: e.target.value})} 
          className="w-full p-2.5 rounded-xl border border-slate-200 outline-none resize-none" 
          required 
        />
      </div>
    </div>
  );
};
