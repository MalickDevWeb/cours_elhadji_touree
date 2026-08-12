import React from 'react';
import { Home, Calendar, Users, Settings, QrCode } from 'lucide-react';

interface Props {
  activeTab: string;
  onNavigate: (tab: any) => void;
  onOpenScanner?: () => void;
}

export const TeacherBottomNav: React.FC<Props> = ({ activeTab, onNavigate, onOpenScanner }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-1.5 px-3 flex justify-around items-center md:hidden pb-[calc(8px+env(safe-area-inset-bottom,0px))]">
      <button 
        onClick={() => onNavigate('ACCUEIL')} 
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${activeTab === 'ACCUEIL' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home className="w-5 h-5 shrink-0" />
        <span className="text-[9px]">Accueil</span>
        {activeTab === 'ACCUEIL' && <span className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
      </button>

      <button 
        onClick={() => onNavigate('SCHEDULE')} 
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${activeTab === 'SCHEDULE' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Calendar className="w-5 h-5 shrink-0" />
        <span className="text-[9px]">Emploi du temps</span>
        {activeTab === 'SCHEDULE' && <span className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
      </button>

      {/* Bouton SCAN au milieu */}
      <div className="relative -top-3.5 flex flex-col items-center shrink-0 mx-1">
        <button
          type="button"
          onClick={onOpenScanner}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/35 border-3 border-white active:scale-95 transition-transform cursor-pointer group"
          title="Scanner Carte / QR Code"
        >
          <QrCode className="w-6 h-6 font-black text-slate-950 group-hover:scale-110 transition-transform" />
        </button>
        <span className="text-[9px] font-extrabold text-amber-600 tracking-tight mt-0.5">Scan</span>
      </div>

      <button 
        onClick={() => onNavigate('CLASSES')} 
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${activeTab === 'CLASSES' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Users className="w-5 h-5 shrink-0" />
        <span className="text-[9px]">Mes classes</span>
        {activeTab === 'CLASSES' && <span className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
      </button>

      <button 
        onClick={() => onNavigate('PARAMETRES')} 
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${activeTab === 'PARAMETRES' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Settings className="w-5 h-5 shrink-0" />
        <span className="text-[9px]">Paramètres</span>
        {activeTab === 'PARAMETRES' && <span className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
      </button>
    </div>
  );
};
