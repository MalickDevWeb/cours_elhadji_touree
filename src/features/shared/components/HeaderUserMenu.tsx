import React from 'react';
import { ChevronDown, User, LogOut, ArrowLeft, Settings } from 'lucide-react';
import { ActiveUser } from '../../../types';

interface HeaderUserMenuProps {
  activeUser: ActiveUser;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (val: boolean) => void;
  isInOwnSpace: boolean;
  isParentTab: boolean;
  space: 'VISITEUR' | 'ADMIN' | 'TEACHER';
  setSpace: (space: 'VISITEUR' | 'ADMIN' | 'TEACHER') => void;
  setIsParentTab: (val: boolean) => void;
  setIsRegistering: (val: boolean) => void;
  onOpenProfile?: () => void;
}

export function HeaderUserMenu({
  activeUser, isUserMenuOpen, setIsUserMenuOpen, isInOwnSpace, isParentTab,
  space, setSpace, setIsParentTab, setIsRegistering, onOpenProfile,
}: HeaderUserMenuProps) {
  const handleNav = (sp: 'VISITEUR' | 'ADMIN' | 'TEACHER', pTab = false, reg = false) => {
    setSpace(sp);
    setIsParentTab(pTab);
    setIsRegistering(reg);
  };

  return (
    <div className="relative">
      <button
        id="header-user-menu-btn"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1 sm:pl-1.5 sm:pr-2.5 rounded-full transition cursor-pointer active:scale-95"
      >
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${activeUser.bg} text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs shrink-0`}>
          {activeUser.initials}
        </div>
        <span className="hidden sm:inline font-bold text-slate-700 text-xs truncate max-w-[120px]">
          {activeUser.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {isUserMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
              <div className="font-bold text-slate-800 truncate">{activeUser.name}</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{activeUser.role}</div>
            </div>
            <div className="p-1 space-y-0.5 text-left">
              {!isInOwnSpace && (
                <button
                  onClick={() => { activeUser.action(); setIsUserMenuOpen(false); }}
                  className="w-full text-left font-semibold text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mon Espace</span>
                </button>
              )}

              {(space !== 'VISITEUR' || isParentTab) && (
                <button
                  onClick={() => { handleNav('VISITEUR'); setIsUserMenuOpen(false); }}
                  className="w-full text-left font-semibold text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span>Page d'accueil</span>
                </button>
              )}

              {activeUser.settingsAction && (
                <button
                  id="user-menu-settings-btn"
                  onClick={() => { activeUser.settingsAction!(); setIsUserMenuOpen(false); }}
                  className="w-full text-left font-semibold text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Paramètres</span>
                </button>
              )}

              <div className="h-px bg-slate-100 my-1" />

              <button
                onClick={() => { activeUser.logout(); setIsUserMenuOpen(false); }}
                className="w-full text-left font-bold text-rose-500 hover:bg-rose-50/60 px-3 py-1.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
