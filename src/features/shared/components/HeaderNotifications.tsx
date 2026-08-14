import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { AppNotification } from '../../parent/domain/parentMockData';

interface HeaderNotificationsProps {
  unreadCount: number;
  activeNotifications: AppNotification[];
  onNotificationClick: (id: string) => void;
  onMarkAllRead: () => void;
}

export function HeaderNotifications({
  unreadCount,
  activeNotifications,
  onNotificationClick,
  onMarkAllRead,
}: HeaderNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (activeNotifications.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50 flex items-center justify-center relative transition cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[8px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xs animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed md:absolute top-16 left-4 right-4 md:top-auto md:left-auto md:right-0 md:mt-2 w-auto md:w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 space-y-3 z-50 text-slate-800 text-xs text-left animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 min-w-0">
                <Bell className="w-3.5 h-3.5 text-sky-500 shrink-0" /> <span className="truncate">Notifications</span>
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    onMarkAllRead();
                  }}
                  className="text-[10px] text-sky-500 hover:text-sky-600 font-bold transition cursor-pointer"
                >
                  Tout lire
                </button>
              )}
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {activeNotifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    onNotificationClick(n.id);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition border text-xs flex gap-2 ${
                    n.isRead
                      ? 'bg-slate-50/50 border-slate-100 text-slate-500'
                      : 'bg-sky-50/30 border-sky-100 text-slate-800 font-medium'
                  }`}
                >
                  <span className="text-base shrink-0">
                    {n.type === 'PAYMENT' ? '💳' : n.type === 'ATTENDANCE' ? '📝' : n.type === 'GRADE' ? '🎯' : '🔔'}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold text-[11px] truncate">{n.title}</div>
                    <p className="text-[10px] leading-relaxed text-slate-500 break-words">{n.body}</p>
                    <span className="text-[8px] text-slate-400 block font-bold">
                      {n.date} à {n.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
