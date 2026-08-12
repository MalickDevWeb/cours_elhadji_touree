'use client';

import { useState } from 'react';
import { useSoutienScolaire } from './features/shared/hooks/useSoutienScolaire';
import { useAppState } from './features/shared/hooks/useAppState';
import { useDynamicTheme } from './features/shared/hooks/useDynamicTheme';
import { AppHeader } from './features/shared/components/AppHeader';
import { VisitorSpaceContainer } from './features/visitor/components/VisitorSpaceContainer';
import { ParentSpaceContainer } from './features/parent/ui/ParentSpaceContainer';
import { AdminSpaceContainer } from './features/admin/components/AdminSpaceContainer';
import { TeacherSpace } from './features/teacher/components/TeacherSpace';
import { AdminPdfModal } from './features/admin/components/AdminPdfModal';
import { AdminLogin } from './features/admin/components/AdminLogin';
import { LoginModal } from './features/shared/components/LoginModal';
import { ErrorBoundary } from './features/shared/components/ErrorBoundary';
import { PwaInstallPrompt } from './features/shared/components/PwaInstallPrompt';
import { AIPaletteModal } from './features/shared/components/AIPaletteModal';

export default function App() {
  const db = useSoutienScolaire();
  const state = useAppState(db);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  useDynamicTheme(db.settings.logoUrl);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <AppHeader
        centerName={db.settings.centerName} logoUrl={db.settings.logoUrl} space={state.space} setSpace={state.setSpace}
        setIsParentTab={state.setIsParentTab} setIsRegistering={state.setIsRegistering}
        activeUser={state.activeUser} isUserMenuOpen={state.isUserMenuOpen} setIsUserMenuOpen={state.setIsUserMenuOpen}
        isInOwnSpace={state.isInOwnSpace} isParentTab={state.isParentTab} setIsLoginModalOpen={state.setIsLoginModalOpen}
        unreadCount={state.unreadCount} activeNotifications={state.activeNotifications}
        onNotificationClick={state.handleNotificationClick} onMarkAllRead={state.onMarkAllRead}
        simulatedTime={state.simulatedTime} setSimulatedTime={state.setSimulatedTime}
        onOpenPalette={() => setIsPaletteOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 xl:px-8 py-8">
        <ErrorBoundary>
          {state.space === 'VISITEUR' && (
            state.isParentTab ? (
              <ParentSpaceContainer
                parents={db.parents} students={db.students} assignments={db.assignments}
                groups={db.groups} payments={db.payments} levels={db.levels} subjects={db.subjects} teachers={db.teachers}
                preinscriptions={db.preinscriptions} addPreinscription={db.addPreinscription} settings={db.settings}
                loggedInParent={{ phone: state.loggedInParentPhone }} onLogout={state.activeUser?.logout || (() => {})}
                onUpdateParentPhone={(ph) => { state.setLoggedInParentPhone(ph); sessionStorage.setItem('loggedInParentPhone', ph); }}
                addPayment={db.addPayment} saveParents={db.saveParents} saveStudents={db.saveStudents}
                onViewReceiptPdf={(pid) => state.setPdfModal({ isOpen: true, type: 'RECEIPT', paymentId: pid })}
                onViewStudentPdf={(id) => state.setPdfModal({ isOpen: true, type: 'FICHE_ELEVE', studentId: id })}
                onRegisterOpenProfile={state.setOpenParentProfileCallback}
              />
            ) : (
              <VisitorSpaceContainer db={db} state={state} />
            )
          )}
          
          {state.space === 'TEACHER' && (
            <TeacherSpace
              db={db} loggedInTeacher={state.loggedInTeacher}
              onLogout={state.activeUser?.logout} onOpenLoginModal={() => state.setIsLoginModalOpen(true)}
              simulatedTime={state.simulatedTime} setSimulatedTime={state.setSimulatedTime}
              onUpdateTeacher={(updated) => { db.saveTeachers(db.teachers.map((t: any) => t.id === updated.id ? updated : t)); state.setLoggedInTeacher(updated); }}
              onRegisterOpenSettings={state.setOpenTeacherSettingsCallback}
            />
          )}

          {state.space === 'ADMIN' && (
            !state.isAdminLoggedIn ? (
              <AdminLogin onLoginSuccess={state.handleAdminLogin} />
            ) : (
              <AdminSpaceContainer db={db} state={state} />
            )
          )}
        </ErrorBoundary>
      </main>

      <AdminPdfModal
        isOpen={state.pdfModal.isOpen} onClose={() => state.setPdfModal(prev => ({ ...prev, isOpen: false }))}
        type={state.pdfModal.type} studentId={state.pdfModal.studentId} paymentId={state.pdfModal.paymentId}
        students={db.students} parents={db.parents} levels={db.levels} subjects={db.subjects}
        assignments={db.assignments} groups={db.groups} payments={db.payments} settings={db.settings}
      />

      <LoginModal
        isOpen={state.isLoginModalOpen} onClose={() => state.setIsLoginModalOpen(false)}
        parents={db.parents} teachers={db.teachers}
        onParentLoginSuccess={state.handleParentLogin} onTeacherLoginSuccess={state.handleTeacherLogin} onAdminLoginSuccess={state.handleAdminLogin}
        initialTab={state.loginModalTab}
      />

      <PwaInstallPrompt />
      <AIPaletteModal isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
}
