import { StudentEntity } from '../domain/Student';

export interface StudentRepository {
  findAll(): Promise<StudentEntity[]>;
  findById(id: string): Promise<StudentEntity | null>;
  findByParentId(parentId: string): Promise<StudentEntity[]>;
  save(student: StudentEntity): Promise<StudentEntity>;
  updatePhoto(id: string, photoUrl: string): Promise<StudentEntity | null>;
  delete(id: string): Promise<boolean>;
}
