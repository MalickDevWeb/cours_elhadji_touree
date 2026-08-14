import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ArrowRight } from 'lucide-react';
import { CourseOffer, Settings, Level, Subject } from '../../../types';
import { defaultSchoolCycles } from '../../shared/infrastructure/mockDbData';
import { CycleFilterBar } from './CycleFilterBar';
import { CycleTarifCard } from './CycleTarifCard';

interface TarifsTabProps {
  settings: Settings; courseOffers: CourseOffer[]; subjects?: Subject[];
  levels: Level[]; onSelectOffer?: (offer: any) => void;
}

export const ProgramsTarifsTab: React.FC<TarifsTabProps> = ({ settings, levels, onSelectOffer }) => {
  const [selectedCycleId, setSelectedCycleId] = useState<string>('ALL');
  const cycles = settings?.cycles || defaultSchoolCycles;

  const filteredCycles = selectedCycleId === 'ALL' ? cycles : cycles.filter(c => c.id === selectedCycleId);
  const getFirstLevelOfCycle = (cycleLevels: string[]) => {
    const match = levels.find(l => cycleLevels.some(cl => cl.toLowerCase() === l.name.toLowerCase()));
    return match?.id || levels[0]?.id || 'lvl-01';
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <CycleFilterBar
        cycles={cycles}
        selectedCycleId={selectedCycleId}
        filteredCount={filteredCycles.length}
        onSelect={setSelectedCycleId}
      />

      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredCycles.map((cyc) => (
            <CycleTarifCard
              key={cyc.id}
              cyc={cyc}
              firstLvlId={getFirstLevelOfCycle(cyc.levels)}
              isPaused={!!settings.isGroupPaused}
              onSelectOffer={onSelectOffer}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-100/50 rounded-3xl border border-amber-200/80 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0"><Home className="w-6 h-6" /></div>
          <div>
            <h4 className="font-bold text-sm text-amber-900">Besoin d'un Cours Particulier (Individuel à Domicile) ?</h4>
            <p className="text-[11px] text-amber-800">Enseignant qualifié dédié chez vous, tous niveaux (Primaire, Collège, Lycée). Rythme sur-mesure.</p>
          </div>
        </div>
        <button type="button" onClick={() => onSelectOffer?.({ type: 'INDIVIDUEL', levelId: levels[0]?.id || 'lvl-01', subjectId: 'sub-01' })} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition shadow-sm cursor-pointer hover:scale-105">
          Demander à Domicile <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
