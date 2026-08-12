import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface AdminMobileMenuProps {
  tabs: Array<{ id: string; label: string; icon: any; color: string }>;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function AdminMobileMenu({ tabs, activeTab, setActiveTab }: AdminMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
  const ActiveIcon = activeTabObj.icon;

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-2">
          <ActiveIcon className={`w-5 h-5 ${activeTabObj.color}`} />
          <span className="text-xs font-bold tracking-wide">{activeTabObj.label}</span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5 text-sky-400 font-semibold text-xs"
        >
          {isOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4" />}
          <span>{isOpen ? 'Fermer' : 'Menu'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
          <div
            className="bg-white rounded-t-3xl w-full p-6 pb-28 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-display font-bold text-slate-800 text-sm">Navigation Admin</h4>
              <button onClick={() => setIsOpen(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full p-3.5 rounded-2xl transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : tab.color}`} />
                      <span className="text-xs font-bold">{tab.label}</span>
                    </div>
                    {isActive && <div className="w-2 h-2 rounded-full bg-sky-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
