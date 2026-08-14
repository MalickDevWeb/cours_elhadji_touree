import React, { useState } from 'react';
import { Plus, Trash2, LucideIcon } from 'lucide-react';

interface ProgramItem {
  id: string;
  name: string;
}

interface ProgramSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  placeholder: string;
  items: ProgramItem[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export const ProgramSection: React.FC<ProgramSectionProps> = ({
  title,
  icon: Icon,
  iconColor,
  placeholder,
  items,
  onAdd,
  onRemove,
}) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
  };

  return (
    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2.5 text-xs">
      <h4 className="font-bold text-slate-700 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} /> {title}
      </h4>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1 max-h-[140px] overflow-y-auto">
        {items.map(item => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg font-bold text-[10px]"
          >
            {item.name}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-slate-400 hover:text-red-500 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
