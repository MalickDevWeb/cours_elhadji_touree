import { validateStudent } from '../validation/StudentValidation';

export interface StudentEntity {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly matricule: string;
  readonly sex: 'M' | 'F';
  readonly birthDate: string;
  readonly levelId: string;
  readonly parentId: string;
  readonly photoUrl?: string;
}

export function createStudentEntity(data: unknown): StudentEntity {
  const validated = validateStudent(data);
  return {
    id: validated.id || `stu_${Date.now()}`,
    firstName: validated.firstName,
    lastName: validated.lastName,
    matricule: validated.matricule || `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
    sex: validated.sex,
    birthDate: validated.birthDate,
    levelId: validated.levelId,
    parentId: validated.parentId,
    photoUrl: validated.photoUrl
  };
}
