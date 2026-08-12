import { firestoreDb } from '../../../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const COLLECTIONS = [
  'subjects', 'levels', 'parents', 'students', 'teachers',
  'courseOffers', 'groups', 'assignments', 'payments',
  'preinscriptions', 'attendanceHistory', 'gradesHistory',
  'observationsHistory', 'notifications', 'settings'
];

export function initFirestoreSync(notifySubscribers: () => void) {
  if (typeof window === 'undefined' || !firestoreDb) return;
  COLLECTIONS.forEach(key => {
    try {
      if (!firestoreDb) return;
      onSnapshot(doc(firestoreDb, 'app_data', key), (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.data().payload;
          if (val !== undefined) {
            localStorage.setItem(`soutien_scolaire_${key}`, JSON.stringify(val));
            notifySubscribers();
          }
        }
      }, () => {});
    } catch (e) {
      console.warn(`Firestore sync init error for ${key}:`, e);
    }
  });
}

export function saveToFirestore(key: string, data: any) {
  if (typeof window === 'undefined' || !firestoreDb) return;
  try {
    setDoc(doc(firestoreDb, 'app_data', key), { payload: data }, { merge: true }).catch(() => {});
  } catch (e) {
    console.warn(`Firestore save error for ${key}:`, e);
  }
}
