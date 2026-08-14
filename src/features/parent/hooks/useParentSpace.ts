import { useState, useMemo } from 'react';
import { Parent, Student, Group, Assignment, Subject, Payment } from '../../../types';
import { initialNotifications, AppNotification } from '../domain/parentMockData';
import { getChildNextCourse, getChildPaymentSummary } from '../domain/parentCalculations';

export function useParentSpace(
  parents: Parent[],
  students: Student[],
  assignments: Assignment[],
  groups: Group[],
  payments: Payment[],
  subjects: Subject[],
  loggedInParentPhone: string,
  addPayment: (amount: number, studentId: string, method: Payment['method'], opts?: any) => void
) {
  const [activeSection, setActiveSection] = useState<'ACCUEIL' | 'ELEVES' | 'PAIEMENT' | 'PARAMETRES'>('ACCUEIL');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [paymentModalStudentId, setPaymentModalStudentId] = useState<string | null>(null);
  const [digitalCardStudentId, setDigitalCardStudentId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'ORANGE_MONEY'>('WAVE');
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [transactionNote, setTransactionNote] = useState('');
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1);

  const currentParent = useMemo(() => {
    return parents.find(
      p => p.phone.trim().replace(/\s+/g, '') === loggedInParentPhone.trim().replace(/\s+/g, '')
    );
  }, [parents, loggedInParentPhone]);

  const myChildren = useMemo(() => {
    return currentParent ? students.filter(s => s.parentId === currentParent.id) : [];
  }, [currentParent, students]);

  const handleExecutePayment = (studentId: string, amount: number) => {
    setPaymentStep(2);
    setTimeout(() => {
      addPayment(amount, studentId, paymentMethod, {
        status: 'EN_ATTENTE',
        proofUrl,
        transactionNote: transactionNote || `Téléphone payeur : ${paymentPhoneNumber}`,
        reference: `${paymentMethod === 'WAVE' ? 'WV' : 'OM'}-${Date.now().toString().slice(-6)}`
      });
      setPaymentStep(3);
    }, 1200);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const nextCourseForDashboard = useMemo(() => {
    for (const child of myChildren) {
      const c = getChildNextCourse(child.id, groups, assignments, subjects);
      if (c) return { ...c, childName: child.firstName };
    }
    return null;
  }, [myChildren, groups, assignments, subjects]);

  const totalPendingAmount = useMemo(() => {
    return myChildren.reduce((sum, child) => sum + getChildPaymentSummary(child.id, payments).remains, 0);
  }, [myChildren, payments]);

  return {
    activeSection, setActiveSection,
    selectedStudentId, setSelectedStudentId,
    studentSearch, setStudentSearch,
    showNotificationsDropdown, setShowNotificationsDropdown,
    showProfileDropdown, setShowProfileDropdown,
    paymentModalStudentId, setPaymentModalStudentId,
    digitalCardStudentId, setDigitalCardStudentId,
    paymentMethod, setPaymentMethod,
    paymentPhoneNumber, setPaymentPhoneNumber,
    proofUrl, setProofUrl,
    transactionNote, setTransactionNote,
    paymentStep, setPaymentStep,
    currentParent, myChildren,
    handleExecutePayment,
    notifications, handleNotificationClick, markAllRead, unreadCount,
    nextCourseForDashboard, totalPendingAmount
  };
}
