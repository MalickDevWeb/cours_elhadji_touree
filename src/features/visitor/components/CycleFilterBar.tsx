import React from 'react';
import { motion } from 'motion/react';
import { SchoolCycle } from '../../../types';
import { CycleIcon } from './CycleIcon';

interface FilterProps {
  cycles: SchoolCycle[];
  selectedCycleId: string;
  filteredCount: number;
  onSelect: (id: string) => void;
}

export const CycleFilterBar: React.FC<FilterProps> = ({ cycles, selectedCycleId, onSelect }) => {
  return (
    <div className="md:hidden w-full mb-4">
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none snap-x text-xs">
        <button
          type="button"
          onClick={() => onSelect('ALL')}
          className={`snap-start shrink-0 relative px-4 py-2 rounded-full font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            selectedCycleId === 'ALL'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <span>Tous les cycles</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
            selectedCycleId === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {cycles.length}
          </span>
        </button>

        {cycles.map(cyc => {
          const isSelected = selectedCycleId === cyc.id;
          return (
            <button
              key={cyc.id}
              type="button"
              onClick={() => onSelect(cyc.id)}
              className={`snap-start shrink-0 relative px-4 py-2 rounded-full font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <CycleIcon name={cyc.name} code={cyc.code} />
              <span>{cyc.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

