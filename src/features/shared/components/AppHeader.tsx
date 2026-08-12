import React from 'react';
import { GraduationCap, Phone, Palette } from 'lucide-react';
import { ActiveUser } from '../../../types';
import { AppNotification } from '../../parent/domain/parentMockData';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderUserMenu } from './HeaderUserMenu';

interface AppHeaderProps {
  centerName: string; space: 'VISITEUR' | 'ADMIN' | 'TEACHER'; setSpace: (space: 'VISITEUR' | 'ADMIN' | 'TEACHER') => void;
  setIsParentTab: (val: boolean) => void; setIsRegistering: (val: boolean) => void; activeUser: ActiveUser | null;
  isUserMenuOpen: boolean; setIsUserMenuOpen: (val: boolean) => void; isInOwnSpace: boolean; isParentTab: boolean;
  setIsLoginModalOpen: (val: boolean) => void; unreadCount: number; activeNotifications: AppNotification[];
  onNotificationClick: (id: string) => void; onMarkAllRead: () => void; simulatedTime: string;
  setSimulatedTime: (val: string) => void; onOpenProfile?: () => void; onOpenPalette?: () => void;
  logoUrl?: string;
}

export function AppHeader({
  centerName, space, setSpace, setIsParentTab, setIsRegistering,
  activeUser, isUserMenuOpen, setIsUserMenuOpen, isInOwnSpace, isParentTab, setIsLoginModalOpen,
  unreadCount, activeNotifications, onNotificationClick, onMarkAllRead, onOpenProfile, onOpenPalette, logoUrl,
}: AppHeaderProps) {
  const handleNav = (sp: 'VISITEUR' | 'ADMIN' | 'TEACHER', pTab = false, reg = false) => {
    setSpace(sp); setIsParentTab(pTab); setIsRegistering(reg);
  };

  const whatsappUrl = "https://wa.me/221776441212?text=Bonjour%20M.%20Elhadji%20Tour%C3%A9,%20je%20souhaite%20des%20informations%20sur%20le%20soutien%20scolaire.";

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 cursor-pointer min-w-0 group" onClick={() => handleNav('VISITEUR')}>
          {logoUrl ? (
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 shadow-xs group-hover:scale-105 transition-transform p-0.5 flex items-center justify-center">
              <img src={logoUrl} alt="Logo École" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-sky-400 text-white rounded-2xl shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          )}
          <div className="min-w-0 block">
            <span className="font-display font-black text-slate-900 text-xs sm:text-sm md:text-base block tracking-tight truncate group-hover:text-sky-600 transition-colors">
              {centerName}
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 block tracking-widest uppercase truncate">
              Dir. Elhadji Touré • Takhikao, Thiès
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          {space === 'ADMIN' && onOpenPalette && (
            <button
              onClick={onOpenPalette}
              className="inline-flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold px-2.5 py-1.5 rounded-xl border border-sky-200 transition text-[10px] sm:text-xs cursor-pointer shrink-0"
              title="Ajuster la palette de couleurs selon le logo"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Couleurs Logo</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl transition text-[10px] sm:text-xs shadow-xs cursor-pointer shrink-0"
            title="Contacter M. Elhadji Touré sur WhatsApp (+221 77 644 12 12)"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp (+221 77 644 12 12)</span>
          </a>

          {activeUser && (
            <HeaderNotifications
              unreadCount={unreadCount} activeNotifications={activeNotifications}
              onNotificationClick={onNotificationClick} onMarkAllRead={onMarkAllRead}
            />
          )}

          {activeUser ? (
            <HeaderUserMenu
              activeUser={activeUser} isUserMenuOpen={isUserMenuOpen} setIsUserMenuOpen={setIsUserMenuOpen}
              isInOwnSpace={isInOwnSpace} isParentTab={isParentTab} space={space} setSpace={setSpace}
              setIsParentTab={setIsParentTab} setIsRegistering={setIsRegistering} onOpenProfile={onOpenProfile}
            />
          ) : (
            <button
              id="portal-login-btn" onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition text-[10px] sm:text-xs shadow-xs cursor-pointer shrink-0"
            >
              <span>Se connecter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
