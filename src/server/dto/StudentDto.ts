export interface StudentDto {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  sex: string;
  birthDate: string;
  levelId: string;
  parentId: string;
  photoUrl?: string;
}

export interface CreateStudentRequestDto {
  firstName: string;
  lastName: string;
  sex?: 'M' | 'F';
  birthDate?: string;
  levelId?: string;
  parentId?: string;
}
