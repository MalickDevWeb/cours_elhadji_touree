import React, { useEffect, useState } from 'react';
import { Users, LogIn } from 'lucide-react';
import { TeacherHome } from './TeacherHome';
import { TeacherSchedule } from './TeacherSchedule';
import { TeacherClasses } from './TeacherClasses';
import { TeacherCourseDetail } from './TeacherCourseDetail';
import { TeacherSettings } from './TeacherSettings';
import { TeacherSidebar } from './TeacherSidebar';
import { TeacherQrScannerModal } from './TeacherQrScannerModal';
import { TeacherBottomNav } from './TeacherBottomNav';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { useTeacherActions } from '../hooks/useTeacherActions';

interface TeacherProps {
  db: any; loggedInTeacher?: any; onLogout?: () => void; onOpenLoginModal?: () => void;
  simulatedTime: string; setSimulatedTime: (val: string) => void;
  onUpdateTeacher?: (updated: any) => void; onRegisterOpenSettings?: (opener: (() => void) | null) => void;
}

export const TeacherSpace: React.FC<TeacherProps> = ({
  db, loggedInTeacher, onOpenLoginModal, simulatedTime, setSimulatedTime, onUpdateTeacher, onRegisterOpenSettings
}) => {
  const me = loggedInTeacher || null;

  if (!me) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-xs text-center mt-6">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-2xs"><Users className="w-6 h-6" /></div>
        <div className="space-y-2">
          <h3 className="font-display font-bold text-slate-800 text-base">Espace Enseignant</h3>
          <p className="text-slate-400 leading-relaxed">Veuillez vous connecter pour accéder à vos cours, classes et présences.</p>
        </div>
        <button id="teacher-open-popup-btn" onClick={onOpenLoginModal} className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-amber-500/20 cursor-pointer">
          <LogIn className="w-4 h-4" /> Se Connecter
        </button>
      </div>
    );
  }

  const dash = useTeacherDashboard(me, db.assignments, db.groups, db.students, db.subjects, simulatedTime, setSimulatedTime);
  const actions = useTeacherActions(me, db.attendanceHistory, db.saveAttendanceHistory, db.observationsHistory, db.saveObservationsHistory, db.notifications, db.saveNotifications, db.subjects);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    onRegisterOpenSettings?.(() => () => { dash.setActiveTab('PARAMETRES'); dash.setSelectedCourseId(null); });
    return () => onRegisterOpenSettings?.(null);
  }, [dash.setActiveTab, dash.setSelectedCourseId, onRegisterOpenSettings]);

  const actCourse = db.assignments.find((a: any) => a.id === dash.selectedCourseId);

  return (
    <div className="max-w-full w-full mx-auto pb-24 md:pb-8 text-xs select-none">
      <div className="flex flex-col md:flex-row gap-6 items-start w-full">
        {!actCourse && <TeacherSidebar activeTab={dash.activeTab} selectedCourseId={dash.selectedCourseId} onNavigate={(tab) => { dash.setActiveTab(tab); dash.setSelectedCourseId(null); }} />}

        <div className="flex-1 min-w-0 w-full">
          <main className="min-h-[400px]">
            {actCourse ? (
              <TeacherCourseDetail course={actCourse} students={db.students} subjects={db.subjects} groups={db.groups} attendanceHistory={db.attendanceHistory} simulatedTime={dash.simulatedTime} onBack={() => dash.setSelectedCourseId(null)} onUpdateAttendance={actions.updateAttendance} onAddObservation={actions.addObservation} onScanQR={actions.scanQRCode} />
            ) : (
              <>
                {dash.activeTab === 'ACCUEIL' && <TeacherHome me={me} stats={dash.stats} nextCourse={dash.nextCourse} subjects={db.subjects} groups={db.groups} students={db.students} onSelectCourse={dash.handleSelectCourse} onOpenScannerModal={() => setIsScannerOpen(true)} />}
                {dash.activeTab === 'SCHEDULE' && <TeacherSchedule myAssignments={dash.myAssignments} subjects={db.subjects} groups={db.groups} students={db.students} onSelectCourse={dash.handleSelectCourse} />}
                {dash.activeTab === 'CLASSES' && <TeacherClasses myGroups={dash.myGroups} myStudents={dash.myStudents} subjects={db.subjects} attendanceHistory={db.attendanceHistory} observationsHistory={db.observationsHistory} />}
                {dash.activeTab === 'PARAMETRES' && <TeacherSettings teacher={me} onUpdateTeacher={onUpdateTeacher || (() => {})} />}
              </>
            )}
          </main>
        </div>
      </div>

      <TeacherQrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} courses={dash.myAssignments} students={db.students} subjects={db.subjects} groups={db.groups} simulatedTime={simulatedTime} onScanQR={actions.scanQRCode} />
      {!actCourse && <TeacherBottomNav activeTab={dash.activeTab} onNavigate={tab => { dash.setActiveTab(tab); dash.setSelectedCourseId(null); }} onOpenScanner={() => setIsScannerOpen(true)} />}
    </div>
  );
};
