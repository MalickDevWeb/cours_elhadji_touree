import React from 'react';
import { Parent, Student, Level, Subject, Preinscription } from '../../../../types';
import { ParentProfileModal } from './ParentProfileModal';
import { StudentCardModal } from './StudentCardModal';
import { AddStudentModal } from './AddStudentModal';

interface ParentModalsProps {
  currentParent: Parent; profState: any; pState: any;
  actStudent?: Student; actLevel?: Level; actCardNo: string; actFinance: any;
  levels: Level[]; subjects: Subject[]; preinscriptions: Preinscription[];
  isAddStudentOpen: boolean;
  onAddStudentClose: () => void; onAddStudentSubmit: (data: Omit<Preinscription, 'id' | 'status' | 'date'>) => void;
}

export function ParentModals({
  currentParent, profState, pState, actStudent, actLevel, actCardNo,
  levels, subjects, isAddStudentOpen, onAddStudentClose, onAddStudentSubmit
}: ParentModalsProps) {
  return (
    <>
      <ParentProfileModal
        isOpen={profState.showProfileModal} onClose={() => profState.setShowProfileModal(false)}
        profileName={profState.profileName} setProfileName={profState.setProfileName}
        profileAddress={profState.profileAddress} setProfileAddress={profState.setProfileAddress}
        profilePhone={profState.profilePhone} setProfilePhone={profState.setProfilePhone}
        profileWhatsapp={profState.profileWhatsapp} setProfileWhatsapp={profState.setProfileWhatsapp}
        isSavingProfile={profState.isSavingProfile} profileSuccess={profState.profileSuccess} onSubmit={profState.executeProfileUpdate}
      />

      {pState.digitalCardStudentId && actStudent && (
        <StudentCardModal student={actStudent} level={actLevel} cardNo={actCardNo} onClose={() => pState.setDigitalCardStudentId(null)} />
      )}

      <AddStudentModal
        isOpen={isAddStudentOpen} onClose={onAddStudentClose} levels={levels}
        subjects={subjects} currentParent={currentParent} onSubmit={onAddStudentSubmit}
      />
    </>
  );
}
