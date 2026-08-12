export interface Parent {
  id: string; fullName: string; phone: string; whatsapp: string; email?: string; address: string; pin?: string; emailNotificationsEnabled?: boolean;
}
export interface Student {
  id: string; parentId: string; firstName: string; lastName: string; sex: 'M' | 'F'; birthDate: string; levelId: string; photoUrl?: string; cardNo?: string;
}
export interface Teacher {
  id: string; fullName: string; phone: string; address: string; subjects: string[]; levels: string[]; availabilities: string; pin?: string;
}
export interface Subject { id: string; name: string; active: boolean; }
export interface Level { id: string; name: string; }
export interface CourseOffer {
  id: string; name: string; subjectId: string; levelId: string; type: 'INDIVIDUEL' | 'GROUPE'; price: number; duration: string; description: string;
}
export interface Group {
  id: string; name: string; levelId: string; subjectId: string; teacherId: string; maxStudents: number; room: string; schedule: string; studentIds: string[];
}
export interface Assignment {
  id: string; type: 'INDIVIDUEL' | 'GROUPE'; studentId?: string; groupId?: string; teacherId: string; subjectId: string; schedule: string; location: string;
}
export interface Payment {
  id: string; studentId: string; amount: number; date: string; method: 'ESPECES' | 'WAVE' | 'ORANGE_MONEY'; reference: string;
  status?: 'VALIDE' | 'EN_ATTENTE' | 'REFUSE'; proofUrl?: string; transactionNote?: string;
}
export interface Preinscription {
  id: string; parentName: string; parentPhone: string; parentWhatsapp: string; parentAddress: string;
  parentPin?: string; parentEmail?: string;
  studentFirstName: string; studentLastName: string; studentSex: 'M' | 'F'; studentBirthDate: string;
  levelId: string; subjectIds: string[]; courseType: 'INDIVIDUEL' | 'GROUPE'; status: 'EN_ATTENTE' | 'CONFIRMEE'; date: string;
}
export interface Testimonial { id: string; author: string; role: string; content: string; }
export interface SchoolCycle {
  id: string;
  name: string;
  code: string;
  levels: string[];
  registrationFee: number;
  monthlyFee: number;
  icon?: string;
}
export interface Settings {
  centerName: string; directorName: string; phone: string; whatsapp: string;
  aboutText: string; historyText: string; methodText: string; valuesText: string;
  testimonials: Testimonial[];
  schoolYear?: string;
  individualPrice?: string;
  groupPrice?: string;
  isIndividualPaused?: boolean;
  isGroupPaused?: boolean;
  email?: string;
  address?: string;
  logoUrl?: string;
  cycles?: SchoolCycle[];
}

export interface ActiveUser {
  name: string;
  role: string;
  initials: string;
  bg: string;
  text: string;
  action: () => void;
  logout: () => void;
  settingsAction?: () => void;
}

