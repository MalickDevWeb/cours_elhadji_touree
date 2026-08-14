import { useState, useMemo } from 'react';
import { ActiveUser } from '../../../types';

const getSS = (k: string) => typeof window !== 'undefined' ? sessionStorage.getItem(k) : null;
const setSS = (k: string, v: string) => typeof window !== 'undefined' && sessionStorage.setItem(k, v);
const remSS = (k: string) => typeof window !== 'undefined' && sessionStorage.removeItem(k);

export function useAppState(db: any) {
  const [space, setSpace] = useState<'VISITEUR' | 'ADMIN' | 'TEACHER'>(() =>
    getSS('isAdminLoggedIn') === 'true' ? 'ADMIN' : getSS('loggedInTeacherId') ? 'TEACHER' : 'VISITEUR'
  );
  const [adminTab, setAdminTab] = useState('DASHBOARD');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => getSS('isAdminLoggedIn') === 'true');
  const [isParentTab, setIsParentTab] = useState(() => getSS('isParentLoggedIn') === 'true');
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(() => getSS('isParentLoggedIn') === 'true');
  const [loggedInParentPhone, setLoggedInParentPhone] = useState(() => getSS('loggedInParentPhone') || '');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'PARENT' | 'TEACHER' | 'ADMIN'>('PARENT');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(() => new Date().toISOString());
  const [openParentProfileCallback, setOpenParentProfileCallback] = useState<(() => void) | null>(null);
  const [openTeacherSettingsCallback, setOpenTeacherSettingsCallback] = useState<(() => void) | null>(null);

  const [loggedInTeacher, setLoggedInTeacher] = useState<any>(() => {
    const saved = getSS('loggedInTeacherId');
    return saved ? (db.teachers.find((t: any) => t.id === saved) || null) : null;
  });

  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; type: 'FICHE_ELEVE' | 'RECEIPT'; studentId?: string; paymentId?: string }>({ isOpen: false, type: 'FICHE_ELEVE' });

  const activeNotifications = useMemo(() => {
    const notifs = db.notifications || [];
    return isParentLoggedIn ? notifs.filter((n: any) => n.id.startsWith('notif-')) :
    loggedInTeacher ? notifs.filter((n: any) => n.id.startsWith('t-')) :
    isAdminLoggedIn ? notifs.filter((n: any) => n.id.startsWith('a-')) : [];
  }, [db.notifications, isParentLoggedIn, loggedInTeacher, isAdminLoggedIn]);

  const unreadCount = useMemo(() => activeNotifications.filter(n => !n.isRead).length, [activeNotifications]);
  const handleNotificationClick = (id: string) => db.saveNotifications(db.notifications.map((n: any) => n.id === id ? { ...n, isRead: true } : n));
  const onMarkAllRead = () => {
    const activeIds = new Set(activeNotifications.map(n => n.id));
    db.saveNotifications(db.notifications.map((n: any) => activeIds.has(n.id) ? { ...n, isRead: true } : n));
  };

  const handleParentLogin = (phone: string) => {
    setIsParentLoggedIn(true); setLoggedInParentPhone(phone);
    setSS('isParentLoggedIn', 'true'); setSS('loggedInParentPhone', phone);
    setIsParentTab(true); setSpace('VISITEUR'); setIsLoginModalOpen(false);
  };
  const handleTeacherLogin = (t: any) => { setLoggedInTeacher(t); setSS('loggedInTeacherId', t.id); setSpace('TEACHER'); setIsLoginModalOpen(false); };
  const handleAdminLogin = () => { setIsAdminLoggedIn(true); setSS('isAdminLoggedIn', 'true'); setSpace('ADMIN'); setAdminTab('DASHBOARD'); setIsLoginModalOpen(false); };

  const activeUser: ActiveUser | null = isParentLoggedIn ? {
    name: db.parents.find((p: any) => p.phone.trim().replace(/\s+/g, '') === loggedInParentPhone.trim().replace(/\s+/g, ''))?.fullName || 'Parent',
    role: 'Espace Parent', initials: 'PR', bg: 'bg-sky-500', text: 'text-sky-500',
    action: () => { setIsParentTab(true); setSpace('VISITEUR'); setIsRegistering(false); },
    logout: () => { setIsParentLoggedIn(false); setLoggedInParentPhone(''); remSS('isParentLoggedIn'); remSS('loggedInParentPhone'); setIsParentTab(false); setIsRegistering(false); },
    settingsAction: openParentProfileCallback ? () => { setIsParentTab(true); setSpace('VISITEUR'); setIsRegistering(false); setTimeout(() => openParentProfileCallback(), 100); } : undefined
  } : loggedInTeacher ? {
    name: loggedInTeacher.fullName, role: 'Enseignant', initials: 'EN', bg: 'bg-amber-500', text: 'text-amber-500',
    action: () => { setSpace('TEACHER'); setIsParentTab(false); setIsRegistering(false); },
    logout: () => { setLoggedInTeacher(null); remSS('loggedInTeacherId'); setSpace('VISITEUR'); setIsParentTab(false); setIsRegistering(false); },
    settingsAction: openTeacherSettingsCallback ? () => { setSpace('TEACHER'); setIsParentTab(false); setIsRegistering(false); setTimeout(() => openTeacherSettingsCallback(), 100); } : undefined
  } : isAdminLoggedIn ? {
    name: db.settings.directorName || 'Directeur', role: 'Administrateur', initials: 'AD', bg: 'bg-rose-500', text: 'text-rose-500',
    action: () => { setSpace('ADMIN'); setIsParentTab(false); setIsRegistering(false); },
    logout: () => { setIsAdminLoggedIn(false); remSS('isAdminLoggedIn'); setSpace('VISITEUR'); setIsParentTab(false); setIsRegistering(false); },
    settingsAction: () => { setSpace('ADMIN'); setIsParentTab(false); setIsRegistering(false); setAdminTab('PARAMETRES'); }
  } : null;

  const isInOwnSpace = (isParentLoggedIn && isParentTab) || (!!loggedInTeacher && space === 'TEACHER') || (isAdminLoggedIn && space === 'ADMIN');
  const isUserLoggedIn = isParentLoggedIn || !!loggedInTeacher || isAdminLoggedIn;

  return {
    space, setSpace, adminTab, setAdminTab, isRegistering, setIsRegistering, selectedOffer, setSelectedOffer,
    isAdminLoggedIn, setIsAdminLoggedIn, isParentTab, setIsParentTab, isParentLoggedIn, setIsParentLoggedIn,
    loggedInParentPhone, setLoggedInParentPhone, isLoginModalOpen, setIsLoginModalOpen, isUserMenuOpen, setIsUserMenuOpen,
    loggedInTeacher, setLoggedInTeacher, pdfModal, setPdfModal, isUserLoggedIn, activeUser, isInOwnSpace,
    handleParentLogin, handleTeacherLogin, handleAdminLogin, unreadCount, activeNotifications, handleNotificationClick,
    onMarkAllRead, simulatedTime, setSimulatedTime, loginModalTab, setLoginModalTab, openParentProfileCallback,
    setOpenParentProfileCallback, openTeacherSettingsCallback, setOpenTeacherSettingsCallback
  };
}
