import { Parent, Student, Teacher, Subject, Level, CourseOffer, Group, Assignment, Payment, Preinscription, Settings } from '../../../types';
import * as seeds from './mockDbData';
import * as actSeeds from './mockActivitiesData';
import { attendanceHistory, gradesHistory, observationsHistory } from '../../parent/domain/parentMockData';
import { initFirestoreSync, saveToFirestore } from './firestoreSync';
import { deduplicateParents } from '../utils/phoneUtils';

const listeners: (() => void)[] = [];
export function subscribeToDb(cb: () => void): () => void {
  listeners.push(cb);
  return () => { const i = listeners.indexOf(cb); if (i > -1) listeners.splice(i, 1); };
}
export function notifyDbSubscribers() { listeners.forEach(cb => cb()); }

initFirestoreSync(notifyDbSubscribers);

export function getDbTable<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed;
  const d = localStorage.getItem(`soutien_scolaire_${key}`);
  if (!d) { localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(seed)); saveData(key, seed); return seed; }
  return JSON.parse(d);
}

export function saveData(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(data));
  notifyDbSubscribers();
  saveToFirestore(key, data);
  fetch('/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, data }) }).catch(() => {});
}

export function saveDbTable<T>(key: string, data: T[]): void { saveData(key, data); }
export function getDbItem<T>(key: string, defVal: T): T {
  if (typeof window === 'undefined') return defVal;
  const d = localStorage.getItem(`soutien_scolaire_${key}`);
  if (!d) { localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(defVal)); saveData(key, defVal); return defVal; }
  return JSON.parse(d);
}
export function saveDbItem<T>(key: string, data: T): void { saveData(key, data); }

const syncRef = (ref: any, data: any) => { if (!ref || !data) return; Object.keys(ref).forEach(k => delete ref[k]); Object.assign(ref, data); };

export const mockDb = {
  getSubjects: () => getDbTable<Subject>('subjects', seeds.initialSubjects),
  saveSubjects: (d: Subject[]) => saveDbTable<Subject>('subjects', d),
  getLevels: () => getDbTable<Level>('levels', seeds.initialLevels),
  saveLevels: (d: Level[]) => saveDbTable<Level>('levels', d),
  getParents: () => deduplicateParents(getDbTable<Parent>('parents', seeds.initialParents)),
  saveParents: (d: Parent[]) => saveDbTable<Parent>('parents', deduplicateParents(d)),
  getStudents: () => getDbTable<Student>('students', seeds.initialStudents),
  saveStudents: (d: Student[]) => saveDbTable<Student>('students', d),
  getTeachers: () => getDbTable<Teacher>('teachers', seeds.initialTeachers),
  saveTeachers: (d: Teacher[]) => saveDbTable<Teacher>('teachers', d),
  getCourseOffers: () => getDbTable<CourseOffer>('courseOffers', seeds.initialCourseOffers),
  saveCourseOffers: (d: CourseOffer[]) => saveDbTable<CourseOffer>('courseOffers', d),
  getGroups: () => getDbTable<Group>('groups', seeds.initialGroups),
  saveGroups: (d: Group[]) => saveDbTable<Group>('groups', d),
  getAssignments: () => getDbTable<Assignment>('assignments', seeds.initialAssignments),
  saveAssignments: (d: Assignment[]) => saveDbTable<Assignment>('assignments', d),
  getPayments: () => getDbTable<Payment>('payments', seeds.initialPayments),
  savePayments: (d: Payment[]) => saveDbTable<Payment>('payments', d),
  getPreinscriptions: () => getDbTable<Preinscription>('preinscriptions', seeds.initialPreinscriptions),
  savePreinscriptions: (d: Preinscription[]) => saveDbTable<Preinscription>('preinscriptions', d),
  getAttendanceHistory: () => { const d = getDbItem('attendanceHistory', actSeeds.initialAttendanceHistory); syncRef(attendanceHistory, d); return d; },
  saveAttendanceHistory: (d: any) => { syncRef(attendanceHistory, d); saveDbItem('attendanceHistory', d); },
  getGradesHistory: () => { const d = getDbItem('gradesHistory', actSeeds.initialGradesHistory); syncRef(gradesHistory, d); return d; },
  saveGradesHistory: (d: any) => { syncRef(gradesHistory, d); saveDbItem('gradesHistory', d); },
  getObservationsHistory: () => { const d = getDbItem('observationsHistory', actSeeds.initialObservationsHistory); syncRef(observationsHistory, d); return d; },
  saveObservationsHistory: (d: any) => { syncRef(observationsHistory, d); saveDbItem('observationsHistory', d); },
  getNotifications: () => getDbItem<actSeeds.AppNotification[]>('notifications', actSeeds.initialNotifications),
  saveNotifications: (d: actSeeds.AppNotification[]) => saveDbItem('notifications', d),
  getSettings: () => getDbItem<Settings>('settings', seeds.initialSettings),
  saveSettings: (d: Settings) => saveDbItem('settings', d)
};
