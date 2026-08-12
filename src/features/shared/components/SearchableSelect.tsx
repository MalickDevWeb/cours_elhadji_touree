import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; suffix?: string }[];
  placeholder: string;
  searchPlaceholder?: string;
  required?: boolean;
  className?: string;
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Rechercher...",
  required = false,
  className = "w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none transition text-slate-700 text-xs"
}: SearchableSelectProps) {
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter(opt => opt.label.toLowerCase().includes(lower));
  }, [options, search]);

  return (
    <div className="space-y-1.5 w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-[11px] placeholder-slate-400 focus:bg-white focus:border-sky-400 outline-none transition"
        />
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={className}
        required={required}
      >
        <option value="">{placeholder} {search.trim() ? `(${filteredOptions.length} trouvés)` : ''}</option>
        {filteredOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}{opt.suffix ? ` ${opt.suffix}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
