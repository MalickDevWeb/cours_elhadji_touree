import { Parent, Student, Teacher, Subject, Level, CourseOffer, Group, Assignment, Payment, Preinscription, Settings, SchoolCycle } from '../../../types';

export const defaultSchoolCycles: SchoolCycle[] = [
  {
    id: 'cyc-01',
    name: 'Cycle primaire',
    code: 'PRIMAIRE',
    levels: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    registrationFee: 5000,
    monthlyFee: 3000,
    icon: '📘'
  },
  {
    id: 'cyc-02',
    name: 'Cycle CEM (Collège)',
    code: 'CEM',
    levels: ['6e', '5e', '4e', '3e'],
    registrationFee: 7000,
    monthlyFee: 4000,
    icon: '📗'
  },
  {
    id: 'cyc-03',
    name: 'Cycle Lycée',
    code: 'LYCEE',
    levels: ['Seconde', 'Première', 'Terminale'],
    registrationFee: 10000,
    monthlyFee: 7000,
    icon: '📙'
  }
];

export const initialSubjects: Subject[] = [
  { id: 'sub-01', name: 'Mathématiques', active: true },
  { id: 'sub-02', name: 'Français', active: true },
  { id: 'sub-03', name: 'Physique-Chimie', active: true },
  { id: 'sub-04', name: 'SVT', active: true },
  { id: 'sub-05', name: 'Anglais', active: true },
  { id: 'sub-06', name: 'Philosophie', active: true }
];

export const initialLevels: Level[] = [
  { id: 'lvl-01', name: 'CI' }, { id: 'lvl-02', name: 'CP' },
  { id: 'lvl-03', name: 'CE1' }, { id: 'lvl-04', name: 'CE2' },
  { id: 'lvl-05', name: 'CM1' }, { id: 'lvl-06', name: 'CM2' },
  { id: 'lvl-07', name: '6e' }, { id: 'lvl-08', name: '5e' },
  { id: 'lvl-09', name: '4e' }, { id: 'lvl-10', name: '3e' },
  { id: 'lvl-11', name: 'Seconde' }, { id: 'lvl-12', name: 'Première' },
  { id: 'lvl-13', name: 'Terminale' }
];

export const initialParents: Parent[] = [
  { id: 'par-01', fullName: 'Abdoulaye Diallo', phone: '+221 77 123 45 67', whatsapp: '+221 77 123 45 67', email: 'abdou.diallo@gmail.com', address: 'Sacré-Cœur 3, Dakar', pin: '4829' },
  { id: 'par-02', fullName: 'Awa Ndiaye', phone: '+221 78 456 12 34', whatsapp: '+221 78 456 12 34', address: 'Mermoz, Dakar', pin: '7153' }
];

export const initialStudents: Student[] = [
  { id: 'std-01', parentId: 'par-01', firstName: 'Moussa', lastName: 'Diallo', sex: 'M', birthDate: '2011-04-12', levelId: 'lvl-10', photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80' }, // 3e
  { id: 'std-02', parentId: 'par-01', firstName: 'Fatou', lastName: 'Diallo', sex: 'F', birthDate: '2015-09-24', levelId: 'lvl-06', photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80' }, // CM2
  { id: 'std-03', parentId: 'par-02', firstName: 'Seydou', lastName: 'Ndiaye', sex: 'M', birthDate: '2008-11-05', levelId: 'lvl-13', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' } // Terminale
];

export const initialTeachers: Teacher[] = [
  { id: 'tch-01', fullName: 'M. Mamadou Ba', phone: '+221 77 222 33 44', address: 'Amitié 2, Dakar', subjects: ['sub-01', 'sub-03'], levels: ['lvl-09', 'lvl-10', 'lvl-11', 'lvl-12', 'lvl-13'], availabilities: 'Mercredis après-midi, Samedis toute la journée', pin: '6392' },
  { id: 'tch-02', fullName: 'Mme Aissatou Sow', phone: '+221 76 555 66 77', address: 'Fann Résidence, Dakar', subjects: ['sub-02', 'sub-05'], levels: ['lvl-01', 'lvl-02', 'lvl-03', 'lvl-04', 'lvl-05', 'lvl-06', 'lvl-07', 'lvl-08', 'lvl-09', 'lvl-10'], availabilities: 'Lundis et Mardis soir à partir de 17h', pin: '3154' },
  { id: 'tch-03', fullName: 'M. Ibrahima Diop', phone: '+221 70 888 99 00', address: 'Liberte 6, Dakar', subjects: ['sub-04', 'sub-06'], levels: ['lvl-11', 'lvl-12', 'lvl-13'], availabilities: 'Vendredis soir et Samedis matin', pin: '8417' }
];

export const initialCourseOffers: CourseOffer[] = [
  { id: 'off-01', name: 'Mathématiques 3e - Groupe', subjectId: 'sub-01', levelId: 'lvl-10', type: 'GROUPE', price: 15000, duration: '2h / session', description: 'Cours de groupe hebdomadaire pour préparer le BFEM.' },
  { id: 'off-02', name: 'Physique-Chimie Terminale - Individuel', subjectId: 'sub-03', levelId: 'lvl-13', type: 'INDIVIDUEL', price: 45000, duration: '1.5h / session', description: 'Suivi individuel intensif à domicile pour le Baccalauréat.' },
  { id: 'off-03', name: 'Français CM2 - Groupe', subjectId: 'sub-02', levelId: 'lvl-06', type: 'GROUPE', price: 10000, duration: '1.5h / session', description: 'Cours de groupe pour consolider la grammaire et la conjugaison en vue du CFEE.' },
  { id: 'off-04', name: 'Mathématiques Terminale - Individuel', subjectId: 'sub-01', levelId: 'lvl-13', type: 'INDIVIDUEL', price: 50000, duration: '2h / session', description: 'Accompagnement intensif en Mathématiques Terminale.' },
  { id: 'off-05', name: 'SVT Terminale - Individuel', subjectId: 'sub-04', levelId: 'lvl-13', type: 'INDIVIDUEL', price: 40000, duration: '2h / session', description: 'Cours particuliers de SVT niveau Terminale.' },
  { id: 'off-06', name: 'Mathématiques Terminale - Groupe', subjectId: 'sub-01', levelId: 'lvl-13', type: 'GROUPE', price: 20000, duration: '2h / session', description: 'Préparation Bac Mathématiques en petit groupe.' },
  { id: 'off-07', name: 'SVT Terminale - Groupe', subjectId: 'sub-04', levelId: 'lvl-13', type: 'GROUPE', price: 15000, duration: '2h / session', description: 'Cours de SVT Terminale en petit groupe.' }
];

export const initialGroups: Group[] = [
  { id: 'grp-01', name: '3e Math Groupe A', levelId: 'lvl-10', subjectId: 'sub-01', teacherId: 'tch-01', maxStudents: 15, room: 'Salle Einstein', schedule: 'Samedi 10h - 12h', studentIds: ['std-01'] }
];

export const initialAssignments: Assignment[] = [
  { id: 'asg-01', type: 'GROUPE', groupId: 'grp-01', teacherId: 'tch-01', subjectId: 'sub-01', schedule: 'Samedi 10h - 12h', location: 'Salle Einstein' },
  { id: 'asg-02', type: 'INDIVIDUEL', studentId: 'std-03', teacherId: 'tch-03', subjectId: 'sub-06', schedule: 'Vendredi 17h - 19h', location: 'Domicile élève (Mermoz)' }
];

export const initialPayments: Payment[] = [
  { id: 'pay-01', studentId: 'std-01', amount: 15000, date: '2026-07-05', method: 'WAVE', reference: 'WV-PAY-9831' },
  { id: 'pay-02', studentId: 'std-03', amount: 45000, date: '2026-07-10', method: 'ESPECES', reference: 'REC-2026-004' }
];

export const initialPreinscriptions: Preinscription[] = [
  {
    id: 'pre-01', parentName: 'Khadidiatou Fall', parentPhone: '+221 77 999 88 77', parentWhatsapp: '+221 77 999 88 77', parentAddress: 'Almadies, Dakar',
    studentFirstName: 'Ousmane', studentLastName: 'Fall', studentSex: 'M', studentBirthDate: '2012-06-18', levelId: 'lvl-09', subjectIds: ['sub-01', 'sub-03'],
    courseType: 'INDIVIDUEL', status: 'EN_ATTENTE', date: '2026-07-17T15:30:00Z'
  }
];

export const initialSettings: Settings = {
  centerName: 'Soutien Scolaire d\'Élite',
  directorName: 'Elhadji Touré',
  phone: '+221 77 644 12 12',
  whatsapp: '+221 77 644 12 12',
  address: 'Takhikao, Thiès, Sénégal',
  email: 'soutien.toure@gmail.com',
  aboutText: 'Le Centre de Soutien Scolaire d\'Élite, dirigé par Elhadji Touré, offre un encadrement pédagogique rigoureux et sur mesure pour les élèves du primaire, collège et lycée en présentiel.',
  historyText: 'Fondé à Thiès, notre centre est né de la volonté de proposer un accompagnement individuel et en petits groupes de haute qualité pédagogique, centré sur la réussite aux examens nationaux (CFEE, BFEM, BAC).',
  methodText: 'Notre méthode repose sur trois piliers : l\'évaluation diagnostique initiale, le ciblage précis des lacunes méthodologiques, et un suivi hebdomadaire rigoureux partagé directement avec les parents.',
  valuesText: 'Rigueur, Excellence, Bienveillance, et Transparence sont les valeurs qui guident chaque jour notre action auprès de vos enfants.',
  testimonials: [
    { id: 'tst-01', author: 'Mme Diop', role: 'Parente d\'élève de Terminale', content: 'Grâce au suivi personnalisé en Physique-Chimie, mon fils a obtenu son Bac avec mention Très Bien. Un grand merci au directeur Elhadji Touré !' },
    { id: 'tst-02', author: 'M. Sy', role: 'Parent d\'élève en 3e', content: 'Les cours en groupe du samedi ont redonné confiance à ma fille. Ses notes en mathématiques sont passées de 8 à 14/20.' }
  ],
  schoolYear: '2026-2027',
  individualPrice: '75 000 FCFA / mois',
  groupPrice: '40 000 FCFA / mois',
  isIndividualPaused: false,
  isGroupPaused: false,
  cycles: defaultSchoolCycles
};
