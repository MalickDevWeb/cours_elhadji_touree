import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let instance: ReturnType<typeof getFirestore> | null = null;
try {
  const dbId = config.firestoreDatabaseId || undefined;
  if (dbId) {
    instance = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, dbId);
  } else {
    instance = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  }
} catch {
  try {
    instance = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);
  } catch (err2) {
    console.error('Failed to initialize Firestore:', err2);
  }
}

export const firestoreDb = instance;

