export interface TeacherDto {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  subjectIds: string[];
  bio?: string;
  isOnline: boolean;
}
