import { TeacherEntity } from '../domain/Teacher';

export interface TeacherRepository {
  findAll(): Promise<TeacherEntity[]>;
  findById(id: string): Promise<TeacherEntity | null>;
  save(teacher: TeacherEntity): Promise<TeacherEntity>;
}
