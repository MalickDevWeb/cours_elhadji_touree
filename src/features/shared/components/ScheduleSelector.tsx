import React, { useState } from 'react';

interface ScheduleSelectorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const TIME_SLOTS = [
  '07h - 09h', '08h - 10h', '09h - 11h', '10h - 12h', '11h - 13h',
  '12h - 14h', '13h - 15h', '14h - 16h', '15h - 17h', '16h - 18h',
  '17h - 19h', '18h - 20h', '19h - 21h', '20h - 22h', '21h - 23h',
  '22h - 00h', '20h - 00h'
];

const HOURS = Array.from({ length: 25 }, (_, i) => i === 24 ? '00h' : `${i < 10 ? '0' : ''}${i}h`);

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  value, onChange, label = "Jours & Plage Horaire", placeholder = "ex: Mercredi 15h - 17h"
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startH, setStartH] = useState<string>('');
  const [endH, setEndH] = useState<string>('');

  const toggleDay = (day: string) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(nextDays);
    updateVal(nextDays, startH, endH);
  };

  const handlePresetSlot = (slot: string) => {
    if (!slot) return;
    const [s, e] = slot.split(' - ');
    setStartH(s || '');
    setEndH(e || '');
    updateVal(selectedDays, s || '', e || '');
  };

  const updateVal = (days: string[], s: string, e: string) => {
    const timeStr = s && e ? `${s} - ${e}` : (s || e);
    const daysStr = days.join(', ');
    const result = timeStr ? (daysStr ? `${daysStr} ${timeStr}` : timeStr) : daysStr;
    onChange(result);
  };

  return (
    <div className="space-y-1.5 text-xs">
      {label && <label className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block mb-1">{label}</label>}
      <div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Jours de la semaine :</span>
        <div className="flex flex-wrap gap-1 mb-1.5">
          {DAYS.map(day => {
            const isSel = selectedDays.includes(day) || value.includes(day);
            return (
              <button key={day} type="button" onClick={() => toggleDay(day)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition cursor-pointer ${
                  isSel ? 'bg-sky-600 text-white border-sky-600 shadow-2xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Créneaux rapides (jusqu'à 00h) :</span>
          <select onChange={(e) => handlePresetSlot(e.target.value)} defaultValue="" className="w-full p-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs outline-none focus:border-sky-500">
            <option value="">Sélectionner un créneau...</option>
            {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sur mesure (Début ➔ Fin) :</span>
          <div className="flex gap-1">
            <select value={startH} onChange={e => { setStartH(e.target.value); updateVal(selectedDays, e.target.value, endH); }} className="w-1/2 p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none">
              <option value="">Début</option>
              {HOURS.slice(6, 24).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <select value={endH} onChange={e => { setEndH(e.target.value); updateVal(selectedDays, startH, e.target.value); }} className="w-1/2 p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none">
              <option value="">Fin</option>
              {HOURS.slice(7).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Planning final généré :</span>
        <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold outline-none focus:border-sky-500" required />
      </div>
    </div>
  );
};
