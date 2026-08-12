import React from 'react';
import { motion } from 'motion/react';
import { Phone, GraduationCap, ArrowRight } from 'lucide-react';
import { Settings } from '../../../types';
import { HeroVisualCard } from './HeroVisualCard';

interface LandingHeroProps {
  settings: Settings;
  onStartPreinscription: () => void;
  onGoToParentSpace?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ settings, onStartPreinscription }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/\s+/g, '')}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl mb-12 border border-slate-800"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -ml-24 -mb-24" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 opacity-90" />
      
      <div className="relative z-10 grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5 text-left">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/15 to-indigo-500/15 text-sky-400 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase border border-sky-500/20">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            <span>Direct par {settings.directorName}</span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Soutien Scolaire <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300">d'Élite</span>
          </motion.h1>
          
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium">{settings.aboutText}</p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
            <button id="hero-enroll-btn" onClick={onStartPreinscription} className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-sky-500/20 text-center text-xs flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shrink-0">
              Inscrire mon enfant <ArrowRight className="w-4 h-4" />
            </button>
            <a id="hero-whatsapp-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] text-center text-xs shadow-md shadow-emerald-950/30 cursor-pointer w-full sm:w-auto shrink-0">
              <Phone className="w-4 h-4 fill-white" /> Nous écrire sur WhatsApp
            </a>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 border-t border-slate-800">
            <div className="bg-slate-900/40 border border-slate-800/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-sky-400">100%</div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Présentiel</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-sky-400">CI à Tle</div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Tous Niveaux</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-sky-400">Thiès</div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Chez vous / Salle</div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="lg:col-span-5 relative flex justify-center items-center mt-4 lg:mt-0">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur-md opacity-20" />
          <HeroVisualCard />
        </motion.div>
      </div>
    </motion.div>
  );
};
