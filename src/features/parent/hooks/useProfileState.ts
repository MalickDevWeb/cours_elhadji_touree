import { useState, FormEvent } from 'react';
import { Parent } from '../../../types';

export function useProfileState(
  parents: Parent[],
  currentParent: Parent | undefined,
  saveParents: (parents: Parent[]) => void,
  onUpdateParentPhone?: (phone: string) => void
) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  const handleOpenProfileModal = () => {
    if (!currentParent) return;
    setProfileName(currentParent.fullName);
    setProfilePhone(currentParent.phone);
    setProfileWhatsapp(currentParent.whatsapp || '');
    setProfileAddress(currentParent.address || '');
    setProfileSuccess('');
    setShowProfileModal(true);
  };

  const executeProfileUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!currentParent) return;
    setIsSavingProfile(true);
    const updated = parents.map(p =>
      p.id === currentParent.id
        ? { ...p, fullName: profileName, phone: profilePhone, whatsapp: profileWhatsapp, address: profileAddress }
        : p
    );
    saveParents(updated);
    if (onUpdateParentPhone && profilePhone !== currentParent.phone) {
      onUpdateParentPhone(profilePhone);
    }
    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSuccess('Votre profil parent a été mis à jour !');
      setTimeout(() => setShowProfileModal(false), 1000);
    }, 600);
  };

  const handleSaveProfile = (updated: Parent) => {
    saveParents(parents.map(p => p.id === updated.id ? updated : p));
    if (onUpdateParentPhone && updated.phone !== currentParent?.phone) {
      onUpdateParentPhone(updated.phone);
    }
  };

  return {
    showProfileModal, setShowProfileModal,
    profileName, setProfileName,
    profilePhone, setProfilePhone,
    profileWhatsapp, setProfileWhatsapp,
    profileAddress, setProfileAddress,
    isSavingProfile,
    profileSuccess,
    handleOpenProfileModal, executeProfileUpdate,
    handleSaveProfile
  };
}
