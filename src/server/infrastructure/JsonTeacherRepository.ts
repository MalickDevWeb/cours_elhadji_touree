import { TeacherRepository } from '../ports/TeacherRepository';
import { TeacherEntity } from '../domain/Teacher';
import { TeacherMapper } from '../mappers/TeacherMapper';
import { readDb, writeDb } from '../dbHelper';

export class JsonTeacherRepository implements TeacherRepository {
  async findAll(): Promise<TeacherEntity[]> {
    const db = readDb();
    return (db.teachers || []).map(TeacherMapper.toEntity);
  }

  async findById(id: string): Promise<TeacherEntity | null> {
    const db = readDb();
    const teacher = (db.teachers || []).find((t: any) => t.id === id);
    return teacher ? TeacherMapper.toEntity(teacher) : null;
  }

  async save(teacher: TeacherEntity): Promise<TeacherEntity> {
    const db = readDb();
    const teachers = db.teachers || [];
    const index = teachers.findIndex((t: any) => t.id === teacher.id);
    const dto = TeacherMapper.toDto(teacher);
    if (index >= 0) {
      teachers[index] = dto;
    } else {
      teachers.push(dto);
    }
    db.teachers = teachers;
    writeDb(db);
    return teacher;
  }
}
