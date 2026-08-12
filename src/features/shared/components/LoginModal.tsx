import React, { useState, useEffect } from 'react';
import { LogIn, X, ShieldAlert } from 'lucide-react';
import { Parent, Teacher } from '../../../types';
import { ParentLoginForm } from './ParentLoginForm';
import { TeacherLoginForm } from './TeacherLoginForm';
import { AdminLoginForm } from './AdminLoginForm';
import { LoginTabs, LoginTab } from './LoginTabs';

interface LoginModalProps {
  isOpen: boolean; onClose: () => void; parents: Parent[]; teachers: Teacher[];
  onParentLoginSuccess: (phone: string) => void; onTeacherLoginSuccess: (teacher: Teacher) => void;
  onAdminLoginSuccess: () => void; initialTab?: LoginTab;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen, onClose, parents, teachers, onParentLoginSuccess, onTeacherLoginSuccess, onAdminLoginSuccess, initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<LoginTab>('PARENT');
  const [error, setError] = useState('');

  useEffect(() => { if (isOpen && initialTab) setActiveTab(initialTab); }, [isOpen, initialTab]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-xs z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500 text-white rounded-lg"><LogIn className="w-5 h-5" /></div>
            <div>
              <h3 className="font-display font-black text-slate-800 text-sm leading-tight">Portail de Connexion</h3>
              <p className="text-slate-400 text-[10px]">Accédez à votre espace sécurisé</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
        </div>

        <LoginTabs activeTab={activeTab} setActiveTab={setActiveTab} setError={setError} />

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}
          {activeTab === 'PARENT' && <ParentLoginForm parents={parents} onSuccess={onParentLoginSuccess} onError={setError} />}
          {activeTab === 'TEACHER' && <TeacherLoginForm teachers={teachers} onSuccess={onTeacherLoginSuccess} onError={setError} />}
          {activeTab === 'ADMIN' && <AdminLoginForm onSuccess={onAdminLoginSuccess} onError={setError} />}
        </div>
      </div>
    </div>
  );
};
