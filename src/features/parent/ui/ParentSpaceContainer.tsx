import { useEffect, useState } from 'react';
import { Home, Users, CreditCard } from 'lucide-react';
import { Parent, Student, Teacher, Subject, Level, Group, Assignment, Payment, Preinscription, Settings } from '../../../types';
import { useParentSpace } from '../hooks/useParentSpace';
import { useProfileState } from '../hooks/useProfileState';
import { ParentDashboard } from './components/ParentDashboard';
import { ParentStudentList } from './components/ParentStudentList';
import { ParentStudentDetail } from './components/ParentStudentDetail';
import { ParentSettings } from './components/ParentSettings';
import { ParentPaymentPage } from './components/ParentPaymentPage';
import { ParentModals } from './components/ParentModals';
import { ParentSidebar } from './components/ParentSidebar';
import { attendanceHistory, gradesHistory, observationsHistory, studentCardNumbers } from '../domain/parentMockData';
import { getChildNextCourse, getChildPaymentSummary } from '../domain/parentCalculations';

interface ParentSpaceContainerProps {
  parents: Parent[]; students: Student[]; assignments: Assignment[]; groups: Group[]; payments: Payment[];
  levels: Level[]; subjects: Subject[]; teachers: Teacher[]; loggedInParent: { phone: string } | null; preinscriptions: Preinscription[];
  settings?: Settings; addPreinscription: (data: Omit<Preinscription, 'id' | 'status' | 'date'>) => Preinscription;
  onLogout: () => void; onUpdateParentPhone?: (phone: string) => void;
  addPayment: (amount: number, studentId: string, method: Payment['method']) => void; saveParents: (parents: Parent[]) => void;
  saveStudents?: (students: Student[]) => void; onViewReceiptPdf: (payId: string) => void; onViewStudentPdf: (id: string) => void; onRegisterOpenProfile?: (opener: (() => void) | null) => void;
}

export function ParentSpaceContainer({
  parents, students, assignments, groups, payments, levels, subjects, teachers, loggedInParent, preinscriptions, settings,
  addPreinscription, onUpdateParentPhone, addPayment, saveParents, saveStudents, onViewReceiptPdf, onViewStudentPdf, onRegisterOpenProfile
}: ParentSpaceContainerProps) {
  const phone = loggedInParent?.phone || '';
  const pState = useParentSpace(parents, students, assignments, groups, payments, subjects, phone, addPayment);
  const profState = useProfileState(parents, pState.currentParent, saveParents, onUpdateParentPhone);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  useEffect(() => {
    onRegisterOpenProfile?.(() => () => { pState.setActiveSection('PARAMETRES'); pState.setSelectedStudentId(null); });
    return () => onRegisterOpenProfile?.(null);
  }, [pState.setActiveSection, pState.setSelectedStudentId, onRegisterOpenProfile]);

  if (!pState.currentParent) return <div className="text-center py-12 font-bold text-slate-500">Erreur : Parent introuvable.</div>;

  const actStudent = students.find(s => s.id === pState.selectedStudentId);
  const actLevel = actStudent ? levels.find(l => l.id === actStudent.levelId) : undefined;
  const actCardNo = actStudent ? (studentCardNumbers[actStudent.id] || `SEN-2026-0000-${actStudent.sex}`) : '';
  const actFinance = actStudent ? getChildPaymentSummary(actStudent.id, payments) : null;
  const childAtt = actStudent ? (attendanceHistory[actStudent.id] || []) : [];
  const presRate = childAtt.length ? Math.round((childAtt.filter(a => a.status === 'PRESENT' || a.status === 'RETARD').length / childAtt.length) * 100) : 100;

  const handleOpenQuickPayment = (childId?: string) => {
    if (pState.myChildren.length === 0) return;
    let targetId = childId || pState.selectedStudentId;
    if (!targetId) {
      const childWithBal = pState.myChildren.find(c => getChildPaymentSummary(c.id, payments).remains > 0);
      targetId = childWithBal ? childWithBal.id : pState.myChildren[0].id;
    }
    pState.setPaymentStep(1);
    pState.setPaymentModalStudentId(targetId);
    pState.setActiveSection('PAIEMENT');
    pState.setSelectedStudentId(null);
  };

  return (
    <div className="max-w-full w-full mx-auto pb-24 md:pb-8 text-xs select-none">
      <div className="flex flex-col md:flex-row gap-6 items-start w-full">
        <ParentSidebar activeSection={pState.activeSection} selectedStudentId={pState.selectedStudentId} onNavigate={(sec) => { pState.setActiveSection(sec); pState.setSelectedStudentId(null); }} onOpenPayment={() => handleOpenQuickPayment()} />

        <div className="flex-1 min-w-0 w-full">
          <main className="min-h-[400px]">
            {pState.activeSection === 'ACCUEIL' && !pState.selectedStudentId ? (
              <ParentDashboard currentParent={pState.currentParent} enrolledCount={pState.myChildren.length} pendingAmount={pState.totalPendingAmount} nextCourse={pState.nextCourseForDashboard} onNavigateToStudents={() => pState.setActiveSection('ELEVES')} onNavigateToPayment={() => handleOpenQuickPayment()} />
            ) : pState.activeSection === 'PAIEMENT' ? (
              <ParentPaymentPage myChildren={pState.myChildren} payments={payments} selectedStudentId={pState.paymentModalStudentId} onSelectStudent={(sId) => pState.setPaymentModalStudentId(sId)} paymentMethod={pState.paymentMethod} setPaymentMethod={pState.setPaymentMethod} paymentPhoneNumber={pState.paymentPhoneNumber} setPaymentPhoneNumber={pState.setPaymentPhoneNumber} proofUrl={pState.proofUrl} setProofUrl={pState.setProofUrl} transactionNote={pState.transactionNote} setTransactionNote={pState.setTransactionNote} paymentStep={pState.paymentStep} setPaymentStep={pState.setPaymentStep} settings={settings} onExecute={(sId, amt) => pState.handleExecutePayment(sId, amt)} onViewReceiptPdf={onViewReceiptPdf} />
            ) : pState.activeSection === 'ELEVES' && !pState.selectedStudentId ? (
              <ParentStudentList students={pState.myChildren} searchQuery={pState.studentSearch} onSearchChange={pState.setStudentSearch} levels={levels} onSelectStudent={pState.setSelectedStudentId} onAddStudent={() => setIsAddStudentOpen(true)} getChildNextCourse={(id) => getChildNextCourse(id, groups, assignments, subjects)} getChildPaymentSummary={(id) => getChildPaymentSummary(id, payments)} />
            ) : pState.activeSection === 'PARAMETRES' ? (
              <ParentSettings parent={pState.currentParent} onSave={profState.handleSaveProfile} onUpdatePhone={onUpdateParentPhone} />
            ) : actStudent && actFinance ? (
              <ParentStudentDetail student={actStudent} level={actLevel} cardNumber={actCardNo} onBack={() => pState.setSelectedStudentId(null)} onShowCard={() => pState.setDigitalCardStudentId(actStudent.id)} onShowPay={() => handleOpenQuickPayment(actStudent.id)} attendance={childAtt} presenceRate={presRate} attendedCount={childAtt.filter(a => a.status === 'PRESENT' || a.status === 'RETARD').length} totalScheduledCount={childAtt.length} retardCount={childAtt.filter(a => a.status === 'RETARD').length} finance={actFinance} grades={gradesHistory[actStudent.id] || []} observations={observationsHistory[actStudent.id] || []} groups={groups} assignments={assignments} subjects={subjects} teachers={teachers} settings={settings} onViewReceiptPdf={onViewReceiptPdf} onViewStudentPdf={onViewStudentPdf} onUpdateStudent={(updated) => saveStudents?.(students.map(s => s.id === updated.id ? updated : s))} />
            ) : null}
          </main>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-4 flex justify-around items-center md:hidden pb-[calc(10px+env(safe-area-inset-bottom,0px))]">
        <button onClick={() => { pState.setActiveSection('ACCUEIL'); pState.setSelectedStudentId(null); }} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${pState.activeSection === 'ACCUEIL' && !pState.selectedStudentId ? 'text-sky-500 font-bold scale-105' : 'text-slate-400'}`}><Home className="w-5 h-5 shrink-0" /><span className="text-[9px]">Accueil</span></button>
        <button onClick={() => handleOpenQuickPayment()} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer font-bold relative ${pState.activeSection === 'PAIEMENT' ? 'text-emerald-600 font-bold scale-105' : 'text-emerald-600/80'}`}><CreditCard className="w-5 h-5 shrink-0 text-emerald-600" /><span className="text-[9px]">Paiement</span></button>
        <button onClick={() => { pState.setActiveSection('ELEVES'); pState.setSelectedStudentId(null); }} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${(pState.activeSection === 'ELEVES' || pState.selectedStudentId) && pState.activeSection !== 'PAIEMENT' ? 'text-sky-500 font-bold scale-105' : 'text-slate-400'}`}><Users className="w-5 h-5 shrink-0" /><span className="text-[9px]">Mes élèves</span></button>
      </div>

      <ParentModals currentParent={pState.currentParent} profState={profState} pState={pState} actStudent={actStudent} actLevel={actLevel} actCardNo={actCardNo} actFinance={actFinance} levels={levels} subjects={subjects} preinscriptions={preinscriptions} isAddStudentOpen={isAddStudentOpen} onAddStudentClose={() => setIsAddStudentOpen(false)} onAddStudentSubmit={(data) => { addPreinscription(data); alert('🎉 Votre demande d\'inscription a bien été envoyée !'); }} />
    </div>
  );
}
