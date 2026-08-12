import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import heroImage from '../../../assets/images/elite_tutoring_hero_1784394233686_1784488166170.jpg';

export const HeroVisualCard: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 max-w-sm sm:max-w-md lg:max-w-full">
      <img 
        src={typeof heroImage === 'string' ? heroImage : (heroImage as any)?.src} 
        alt="Soutien Scolaire d'Élite" 
        className="w-full h-auto object-cover object-center max-h-[320px] lg:max-h-[380px] transition duration-500 hover:scale-[1.03]"
        referrerPolicy="no-referrer"
      />
      <div className="relative sm:absolute sm:bottom-4 sm:left-4 sm:right-4 m-3 sm:m-0 bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-md">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-sky-400">Encadrement d'Élite</p>
          <p className="text-[10px] text-slate-300">Rigueur, Méthode & Excellence Académique</p>
        </div>
      </div>
      <div className="absolute top-4 right-4 bg-emerald-500/90 text-white font-bold px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
        <ShieldCheck className="w-3 h-3 fill-white text-emerald-500" />
        <span>Label d'Excellence</span>
      </div>
    </div>
  );
};
