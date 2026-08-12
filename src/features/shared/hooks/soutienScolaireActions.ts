import { mockDb } from '../infrastructure/mockDb';
import { Parent, Student, Preinscription } from '../../../types';
import { generateRandomPin } from '../utils/whatsappHelper';
import { arePhonesEqual } from '../utils/phoneUtils';

export function handleAddPreinscription(data: Omit<Preinscription, 'id' | 'status' | 'date'>): Preinscription {
  const newPre: Preinscription = { ...data, id: `pre-${Date.now()}`, status: 'EN_ATTENTE', date: new Date().toISOString() };
  mockDb.savePreinscriptions([...mockDb.getPreinscriptions(), newPre]);

  const notifs = mockDb.getNotifications();
  const newNotif = {
    id: `a-pre-${Date.now()}`,
    title: 'Nouvelle Pré-inscription ! 📝',
    body: `Élève : ${data.studentFirstName} ${data.studentLastName}. Parent : ${data.parentName} (${data.parentPhone}). Cliquez pour valider.`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    isRead: false,
    type: 'SYSTEM' as const
  };
  mockDb.saveNotifications([newNotif, ...notifs]);
  return newPre;
}

export function handleApprovePreinscription(id: string): void {
  const preins = mockDb.getPreinscriptions();
  const target = preins.find(p => p.id === id);
  if (!target) return;

  const parents = mockDb.getParents();
  const existingParent = parents.find(p => arePhonesEqual(p.phone, target.parentPhone));
  let parentId = existingParent?.id;

  const finalPin = (target.parentPin && target.parentPin.length === 4) 
    ? target.parentPin 
    : (existingParent?.pin && existingParent.pin.length === 4 ? existingParent.pin : generateRandomPin());

  if (!existingParent) {
    parentId = `par-${Date.now()}`;
    const newParent: Parent = {
      id: parentId, fullName: target.parentName, phone: target.parentPhone,
      whatsapp: target.parentWhatsapp, address: target.parentAddress, pin: finalPin
    };
    mockDb.saveParents([...parents, newParent]);
  } else {
    mockDb.saveParents(parents.map(p => p.id === existingParent.id ? { ...p, pin: finalPin } : p));
  }

  const students = mockDb.getStudents();
  const newStudent: Student = {
    id: `std-${Date.now()}`, parentId: parentId || '', firstName: target.studentFirstName,
    lastName: target.studentLastName, sex: target.studentSex, birthDate: target.studentBirthDate, levelId: target.levelId
  };
  mockDb.saveStudents([...students, newStudent]);
  mockDb.savePreinscriptions(preins.map(p => p.id === id ? { ...p, status: 'CONFIRMEE', parentPin: finalPin } : p));

  const notifs = mockDb.getNotifications();
  const parentNotif = {
    id: `notif-${Date.now()}`,
    title: '📲 Validation WhatsApp : Inscription Acceptée !',
    body: `Bonjour ${target.parentName}, l'inscription de ${target.studentFirstName} ${target.studentLastName} a été validée. Vos accès WhatsApp (${target.parentPhone} / Code secret : ${finalPin}) vous permettent d'accéder à l'Espace Parent sans frais.`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    isRead: false,
    type: 'SYSTEM' as const
  };
  mockDb.saveNotifications([parentNotif, ...notifs]);
}
