import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Subject, Level, CourseOffer } from '../../../types';
import { ProgramsNiveauxTab } from './ProgramsNiveauxTab';
import { ProgramsTarifsTab } from './ProgramsTarifsTab';

interface PricingProgramsProps {
  settings: Settings;
  subjects: Subject[];
  levels: Level[];
  courseOffers: CourseOffer[];
  onSelectOffer?: (offer: CourseOffer) => void;
}

export const PricingPrograms: React.FC<PricingProgramsProps> = ({ settings, subjects, levels, courseOffers, onSelectOffer }) => {
  const [activeTab, setActiveTab] = useState<'NIVEAUX' | 'TARIFS'>('TARIFS');

  return (
    <div className="space-y-6 mb-12">
      <div className="flex justify-center">
        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/80 w-full max-w-md font-bold relative shadow-inner">
          {(['TARIFS', 'NIVEAUX'] as const).map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 py-2.5 text-xs rounded-xl transition-colors duration-200 cursor-pointer text-center font-bold z-10 ${
                  isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePricingTab"
                    className="absolute inset-0 bg-sky-600 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {tab === 'NIVEAUX' ? 'Programmes & Matières' : 'Offres & Tarifs'}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {activeTab === 'NIVEAUX' && <ProgramsNiveauxTab subjects={subjects} settings={settings} />}
        {activeTab === 'TARIFS' && (
          <ProgramsTarifsTab 
            settings={settings} 
            courseOffers={courseOffers} 
            subjects={subjects}
            levels={levels}
            onSelectOffer={onSelectOffer} 
          />
        )}
      </motion.div>
    </div>
  );
};
