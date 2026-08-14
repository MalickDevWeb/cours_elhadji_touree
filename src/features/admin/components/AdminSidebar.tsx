import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface AdminSidebarProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export function AdminSidebar({ tabs, activeTab, onSelectTab }: AdminSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-1.5 h-fit sticky top-24">
      <div className="px-3 mb-2">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Menu Principal</p>
      </div>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`admin-tab-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${
              isActive ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : tab.color}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
