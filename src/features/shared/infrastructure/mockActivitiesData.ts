export interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'RETARD';
  subjectName: string;
  time: string;
}

export interface GradeRecord {
  subjectName: string;
  grades: number[];
  average: number;
  comment: string;
}

export interface ObservationRecord {
  date: string;
  teacherName: string;
  subjectName: string;
  text: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  time: string;
  isRead: boolean;
  type: 'PAYMENT' | 'ATTENDANCE' | 'GRADE' | 'SYSTEM';
}

export const initialAttendanceHistory: Record<string, AttendanceRecord[]> = {
  'std-01': [
    { date: '2026-07-18', status: 'PRESENT', subjectName: 'Mathématiques', time: '10:05' },
    { date: '2026-07-11', status: 'PRESENT', subjectName: 'Mathématiques', time: '10:02' },
    { date: '2026-07-04', status: 'RETARD', subjectName: 'Mathématiques', time: '10:15' },
    { date: '2026-06-27', status: 'ABSENT', subjectName: 'Mathématiques', time: '--:--' },
  ],
  'std-02': [
    { date: '2026-07-15', status: 'PRESENT', subjectName: 'Français', time: '15:32' },
    { date: '2026-07-08', status: 'PRESENT', subjectName: 'Français', time: '15:30' },
    { date: '2026-07-01', status: 'PRESENT', subjectName: 'Français', time: '15:31' },
  ]
};

export const initialGradesHistory: Record<string, GradeRecord[]> = {
  'std-01': [
    { subjectName: 'Mathématiques', grades: [15, 14, 16], average: 15.0, comment: 'Très actif, logique solide.' },
    { subjectName: 'Physique-Chimie', grades: [12, 13, 14], average: 13.0, comment: 'Bon travail, régulier.' },
    { subjectName: 'Français', grades: [11, 13], average: 12.0, comment: 'En progrès constant.' }
  ],
  'std-02': [
    { subjectName: 'Français', grades: [16, 17, 15], average: 16.0, comment: 'Élève modèle, expression écrite excellente.' },
    { subjectName: 'Mathématiques', grades: [12, 14], average: 13.0, comment: 'Bonne volonté, continue l\'effort.' }
  ]
};

export const initialObservationsHistory: Record<string, ObservationRecord[]> = {
  'std-01': [
    { date: '2026-07-12', teacherName: 'M. Mamadou Ba', subjectName: 'Mathématiques', text: 'Moussa a fait d\'immenses progrès en géométrie. Il doit continuer à participer ainsi.' }
  ],
  'std-02': [
    { date: '2026-07-14', teacherName: 'Mme Aissatou Sow', subjectName: 'Français', text: 'Fatou est extrêmement attentive et apporte des réponses pertinentes. C\'est un plaisir de l\'avoir en classe.' }
  ]
};

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Rappel : Frais de scolarité',
    body: 'Le paiement des frais du mois pour Fatou Diallo est en attente (10 000 FCFA).',
    date: '2026-07-19',
    time: '08:30',
    isRead: false,
    type: 'PAYMENT',
  },
  {
    id: 'notif-2',
    title: 'Présence enregistrée',
    body: 'Moussa Diallo a été validé présent au cours de Mathématiques par M. Mamadou Ba.',
    date: '2026-07-18',
    time: '10:05',
    isRead: false,
    type: 'ATTENDANCE',
  },
  {
    id: 'notif-3',
    title: 'Nouvelle note d\'évaluation',
    body: 'Moussa Diallo a obtenu un 16/20 en Mathématiques. Commentaire : "Excellent devoir !"',
    date: '2026-07-15',
    time: '14:20',
    isRead: true,
    type: 'GRADE',
  }
];
