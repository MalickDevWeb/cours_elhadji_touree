import React from 'react';
import { LayoutDashboard, Users, BookOpen, Receipt, Settings } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsersSection } from './AdminUsersSection';
import { AdminAssignments } from './AdminAssignments';
import { AdminFinanceSection } from './AdminFinanceSection';
import { AdminSettings } from './AdminSettings';
import { AdminMobileMenu } from './AdminMobileMenu';
import { AdminSidebar } from './AdminSidebar';
import { arePhonesEqual } from '../../shared/utils/phoneUtils';

interface AdminSpaceContainerProps {
  db: any;
  state: any;
}

export function AdminSpaceContainer({ db, state }: AdminSpaceContainerProps) {
  const handleAddStudent = (std: any, parentInput: any) => {
    const parents = db.parents || [];
    const existingParent = parents.find((p: any) => arePhonesEqual(p.phone, parentInput.phone));

    let parentId = existingParent?.id;

    if (!existingParent) {
      parentId = `par-${Date.now()}`;
      const newParent = { id: parentId, ...parentInput };
      db.saveParents([...parents, newParent]);
    } else {
      parentId = existingParent.id;
      const updatedParents = parents.map((p: any) => p.id === existingParent.id ? { ...p, ...parentInput, id: existingParent.id, pin: p.pin || parentInput.pin } : p);
      db.saveParents(updatedParents);
    }

    const newStudent = { ...std, id: `std-${Date.now()}`, parentId };
    db.saveStudents([...db.students, newStudent]);
  };

  const tabs = [
    { id: 'DASHBOARD', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-sky-500' },
    { id: 'UTILISATEURS', label: 'Utilisateurs', icon: Users, color: 'text-indigo-500' },
    { id: 'COURS', label: 'Cours & Groupes', icon: BookOpen, color: 'text-amber-500' },
    { id: 'FINANCE', label: 'Finance', icon: Receipt, color: 'text-emerald-500' },
    { id: 'PARAMETRES', label: 'Paramètres', icon: Settings, color: 'text-slate-500' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 pb-24 md:pb-0 items-start w-full">
      <AdminSidebar tabs={tabs} activeTab={state.adminTab} onSelectTab={state.setAdminTab} />
      <AdminMobileMenu tabs={tabs} activeTab={state.adminTab} setActiveTab={state.setAdminTab} />

      <div className="flex-1 min-w-0 w-full space-y-6">
        {state.adminTab === 'DASHBOARD' && <AdminDashboard students={db.students} teachers={db.teachers} parents={db.parents} preinscriptions={db.preinscriptions} payments={db.payments} levels={db.levels} onNavigateToTab={state.setAdminTab} onApprovePre={db.approvePreinscription} />}
        {state.adminTab === 'UTILISATEURS' && (
          <AdminUsersSection
            students={db.students} parents={db.parents} teachers={db.teachers} levels={db.levels} subjects={db.subjects}
            onAddStudent={handleAddStudent} onAddTeacher={db.addTeacher} onUpdateStudents={db.saveStudents} onUpdateParents={db.saveParents}
            onUpdateTeachers={db.saveTeachers} onViewPdf={id => state.setPdfModal({ isOpen: true, type: 'FICHE_ELEVE', studentId: id })}
          />
        )}
        {state.adminTab === 'COURS' && <AdminAssignments assignments={db.assignments} students={db.students} teachers={db.teachers} subjects={db.subjects} groups={db.groups} levels={db.levels} onAddAssignment={db.addAssignment} onAddGroup={db.addGroup} onUpdateAssignment={db.saveAssignments} onUpdateGroup={db.saveGroups} />}
        {state.adminTab === 'FINANCE' && <AdminFinanceSection payments={db.payments} students={db.students} parents={db.parents} levels={db.levels} onAddPayment={db.addPayment} onValidatePayment={db.validatePayment} onViewPdf={id => state.setPdfModal({ isOpen: true, type: 'RECEIPT', paymentId: id })} />}
        {state.adminTab === 'PARAMETRES' && (
          <AdminSettings
            settings={db.settings} onUpdateSettings={db.updateSettings} subjects={db.subjects} onUpdateSubjects={db.saveSubjects}
            levels={db.levels} onUpdateLevels={db.saveLevels} courseOffers={db.courseOffers} onUpdateCourseOffers={db.saveCourseOffers}
          />
        )}
      </div>
    </div>
  );
}
